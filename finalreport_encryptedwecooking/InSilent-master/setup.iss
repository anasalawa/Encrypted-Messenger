#define MyAppName InSilent"
#define MyAppVersion " "
#define MyAppPublisher "Tobias Zeising"
#define MyAppURL ""
#define LaunchProgram "Starte InSilent nach der Installation"
#define DesktopIcon "Shortcut auf dem Desktop erstellen"
#define CreateDesktopIcon "Wollen Sie einen Shortcut auf dem Desktop erstellen?"

[Setup]
AppId={F3E30478-2D70-4CBC-AB4F-0B7A0A4D44AB}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
Compression=lzma
SolidCompression=yes
OutputDir=./bin/
OutputBaseFilename=sum-setup-{#MyAppVersion}

[Languages]
Name: "german"; MessagesFile: "compiler:Languages\German.isl"

[Files]
Source: "bin/SUM/win64/*"; Excludes: "ffmpegsumo.dll,libEGL.dll,libGLESv2.dll" ; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
Source: "app/favicon.ico"; DestDir: "{app}"; DestName: "icon.ico"; Flags: ignoreversion

[Tasks]
Name: "desktopicon"; Description: "{#CreateDesktopIcon}"; GroupDescription: "{#DesktopIcon}"

[Icons]
Name: "{group}\Secure Ultimate Messenger"; Filename: "{app}\SUM.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"
Name: "{userstartup}\Secure Ultimate Messenger"; Filename: "{app}\SUM.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"
Name: "{userdesktop}\Secure Ultimate Messenger"; Filename: "{app}\SUM.exe"; WorkingDir: "{app}"; IconFilename: "{app}/icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\SUM.exe"; WorkingDir: "{app}"; Description: {#LaunchProgram}; Flags: postinstall shellexec
