if (typeof fs == 'undefined') fs = require('fs');
if (typeof lockFile == 'undefined') lockFile = require('lockfile');

/**
 * helpers for file system access
 *
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 */
define('sum-backend-filesystem', Class.extend({

    /**
     * backends crypto functions
     */
    backendCrypto: injected('sum-backend-crypto'),

    
    /**
     * write object as json in file
     * @param file (string) filename for writing the content
     * @param content (object) will be json encoded written into file
     * @param success (callback) will be called on success
     * @param error (function) will be executed on error
     * @param password (string) password for encryption
     */
    writeEncryptedFile: function(file, content, success, error, password) {
        try {
            var encrypted = this.backendCrypto.aesencrypt(JSON.stringify(content), password);
            this.writeFile(file, encrypted, success, error);
        } catch(err) {
            error(lang.backend_filesystem_write_error.replace(/\%s/, typeof err !== 'undefined' && typeof err.ToString !== 'undefined' ? err.toString().escape() : ''));
        }
    },
    
    
    /**
     * read json encoded file and return as object
     * @param file (string) path and filename
     * @param success (function) after successfully reading and json parsing content of file
     * @param error (function) after error on reading and json parsing content of file
     * @param password (string) password for decryption
     */
    readEncryptedFile: function(file, success, error, password) {
        var that = this;
        this.readFile(file, function(data) {
            try {
                var decrypt = JSON.parse(that.backendCrypto.aesdecrypt(data.toString(), password));
                success(decrypt);
            } catch(e) {
                error();
            }
        }, error);
    },
    

    /**
     * write object as json in file
     * @param file (string) filename for writing the content
     * @param content (object) will be json encoded written into file
     * @param success (callback) will be called on success
     * @param error (function) will be executed on error
     */
    writeJsonFile: function(file, content, success, error) {
        if (typeof error == 'undefined')
            error = function(error) {
                throw new Error(error);
            };

        fs.writeFile(file, JSON.stringify(content, null, 4), 'utf8', function(err) {
            if(err) {
                error(lang.backend_filesystem_write_error.replace(/\%s/, err.toString().escape()));
            } else if (typeof success != 'undefined')
                success();
        });
    },


    /**
     * read json encoded file and return as object
     * @param file (string) path and filename
     * @param success (function) after successfully reading and json parsing content of file
     * @param error (function) after error on reading and json parsing content of file
     */
    readJsonFile: function(file, success, error) {
        if (typeof error == 'undefined')
            error = function() {};

        fs.readFile(file, 'utf8', function (err, data) {
            var res = [];
            if (err) {
                error(err);
                return;
            }

            try {
                res = JSON.parse(data);
            } catch (er) {
                error(lang.backend_filesystem_read_json_error);
            }

            success(res);
        });
    },


    /**
     * write in file
     * @param file (string) filename for writing the content
     * @param content (string) will be json encoded written into file
     * @param success (callback) will be called on success
     * @param error (function) will be executed on error
     */
    writeFile: function(file, content, success, error) {
        if (typeof error == 'undefined')
            error = function(error) {
                throw new Error(error);
            };

        fs.writeFile(file, content, 'utf8', function(err) {
            if(err) {
                error(lang.backend_filesystem_write_error.replace(/\%s/, err.toString().escape()));
            } else if (typeof success != 'undefined')
                success();
        });
    },
    
    
    /**
     * read file and return as ByteBuffer
     * @param file (string) path and filenam
     * @param success (function) contains file data
     * @param error (function) will be executed on error
     */
    readFile: function(file, success, error) {
        fs.readFile(file, function (err, data) {
            if (err) {
                error(lang.backend_filesystem_read_error.replace(/\%s/, err.toString().escape()));
                return;
            }

            success(data);
        });
    },


    /**
     * get lock for user list file.
     * @param callback (function) callback after locking successfully or not successfully the file
     */
    lock: function(callback) {
        lockFile.lock(config.lock_file, { stale: config.lock_stale }, callback);
    },


    /**
     * release lock for user list file
     */
    unlock: function() {
        lockFile.unlock(config.lock_file, function(err) {});
    },


    /**
     * get directories of given directory
     * @return (array) directories found
     * @param dir (string) the target directory
     */
    getDirectories: function(dir) {
        try {
            fs.accessSync(dir);
        } catch(e) {
            return [];
        }
        return fs.readdirSync(dir).filter(function (file) {
            return fs.statSync(dir + file).isDirectory();
        });
    },


    /**
     * returns true if given file exists
     * @param filename (string) given path and filename
     * @returns {boolean} true for existing files
     */
    fileExists: function(filename) {
        try {
            fs.accessSync(filename);
        } catch(e) {
            return false;
        }
        return true;
    }
}));
