$out = @()

# Check authentication mode from registry
$regPath = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer"
if (Test-Path $regPath) {
    $loginMode = (Get-ItemProperty -Path $regPath -Name LoginMode -ErrorAction SilentlyContinue).LoginMode
    $out += "=== Authentication Mode ==="
    if ($loginMode -eq 1) { $out += "LoginMode = 1 (Windows Authentication only)" }
    elseif ($loginMode -eq 2) { $out += "LoginMode = 2 (Mixed Mode - SQL + Windows)" }
    else { $out += "LoginMode = $loginMode (Unknown)" }
}
else {
    $out += "Registry path not found, trying to find correct instance path..."
    $instances = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server" -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -like "MSSQL*" }
    foreach ($inst in $instances) {
        $out += "Found instance key: $($inst.PSChildName)"
        $mssqlPath = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$($inst.PSChildName)\MSSQLServer"
        if (Test-Path $mssqlPath) {
            $loginMode = (Get-ItemProperty -Path $mssqlPath -Name LoginMode -ErrorAction SilentlyContinue).LoginMode
            $out += "  LoginMode = $loginMode"
        }
    }
}

# Check if cloth_user login exists
$out += ""
$out += "=== Checking SQL Login via sqlcmd ==="
try {
    $result = sqlcmd -S "localhost,1433" -Q "SELECT name, type_desc, is_disabled FROM sys.server_principals WHERE name = 'cloth_user'" -E -h -1 2>&1
    $out += $result
}
catch {
    $out += "sqlcmd failed: $_"
}

$out | Out-File -FilePath "auth_diag.txt" -Encoding UTF8
Write-Host "Done - see auth_diag.txt"
