$out = @()

# Step 1: Enable Mixed Mode Authentication
$out += "=== Step 1: Enable Mixed Mode ==="
try {
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer" -Name "LoginMode" -Value 2
    $out += "LoginMode set to 2 (Mixed Mode) successfully"
}
catch {
    $out += "Failed to set LoginMode: $_"
}

# Step 2: Create cloth_user login and grant access via sqlcmd with Windows Auth
$out += ""
$out += "=== Step 2: Create SQL Login cloth_user ==="
$sqlScript = @"
-- Enable Mixed Mode (also via T-SQL)
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2;

-- Create login if not exists
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'cloth_user')
BEGIN
    CREATE LOGIN [cloth_user] WITH PASSWORD = '123456', DEFAULT_DATABASE = [ClothShopDB], CHECK_POLICY = OFF;
    PRINT 'Login cloth_user created';
END
ELSE
BEGIN
    -- Reset password and enable
    ALTER LOGIN [cloth_user] WITH PASSWORD = '123456';
    ALTER LOGIN [cloth_user] ENABLE;
    PRINT 'Login cloth_user already exists, password reset and enabled';
END

-- Grant access to ClothShopDB
USE [ClothShopDB];
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'cloth_user')
BEGIN
    CREATE USER [cloth_user] FOR LOGIN [cloth_user];
    PRINT 'User cloth_user created in ClothShopDB';
END

-- Grant db_owner role
ALTER ROLE db_owner ADD MEMBER [cloth_user];
PRINT 'cloth_user added to db_owner role';
GO
"@

$sqlScript | Out-File -FilePath "setup_user.sql" -Encoding UTF8

try {
    $result = sqlcmd -S "localhost,1433" -E -C -i "setup_user.sql" 2>&1
    $out += $result
}
catch {
    $out += "sqlcmd error: $_"
}

# Step 3: Restart SQL Server
$out += ""
$out += "=== Step 3: Restart SQL Server ==="
try {
    Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force
    Start-Sleep -Seconds 3
    $svc = Get-Service -Name "MSSQL`$SQLEXPRESS"
    $out += "SQL Server restarted. Status: $($svc.Status)"
}
catch {
    $out += "Failed to restart: $_"
}

# Step 4: Verify login mode
$out += ""
$out += "=== Step 4: Verify ==="
$loginMode = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer" -Name LoginMode).LoginMode
$out += "LoginMode is now: $loginMode"

$out | Out-File -FilePath "fix_auth_output.txt" -Encoding UTF8
Write-Host "Done - see fix_auth_output.txt"
