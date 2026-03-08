$out = @()
$out += "=== SQL Services ==="
Get-Service -Name 'MSSQL*','SQLBrowser','SQLWriter' -ErrorAction SilentlyContinue | ForEach-Object { $out += "$($_.Name) - Status: $($_.Status) - StartType: $($_.StartType)" }
$out += ""
$out += "=== Listening TCP Ports (SQL related) ==="
$sqlProc = Get-Process sqlservr -ErrorAction SilentlyContinue
if ($sqlProc) {
    $out += "SQL Server PID: $($sqlProc.Id)"
    $conns = Get-NetTCPConnection -OwningProcess $sqlProc.Id -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) { $out += "  Listening: $($c.LocalAddress):$($c.LocalPort)" }
} else {
    $out += "sqlservr process NOT found"
}
$out += ""
$out += "=== Port 1433 check ==="
$p1433 = Get-NetTCPConnection -LocalPort 1433 -State Listen -ErrorAction SilentlyContinue
if ($p1433) { $out += "Port 1433 IS listening" } else { $out += "Port 1433 NOT listening" }
$out += ""
$out += "=== UDP Port 1434 (SQL Browser) ==="
$udp = Get-NetUDPEndpoint -LocalPort 1434 -ErrorAction SilentlyContinue
if ($udp) { $out += "UDP 1434 IS open (SQL Browser)" } else { $out += "UDP 1434 NOT open (SQL Browser not running?)" }
$out += ""
$out += "=== Firewall Rules for SQL ==="
Get-NetFirewallRule -DisplayName '*SQL*' -ErrorAction SilentlyContinue | ForEach-Object { $out += "$($_.DisplayName) - Enabled: $($_.Enabled) - Direction: $($_.Direction)" }

$out | Out-File -FilePath "diag_output.txt" -Encoding UTF8
Write-Host "Done - see diag_output.txt"
