param(
  [string]$DumpPath,
  [string]$Db = "mtn_erp",
  [string]$Host = "localhost",
  [string]$Port = "5432",
  [string]$User = "postgres",
  [string]$ServiceName = ""
)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $DumpPath)) { throw "Dump bulunamadı: $DumpPath" }
$sha = "$DumpPath.sha256"
if (-not (Test-Path $sha)) { throw "Checksum yok: $sha" }
$line = Get-Content $sha -TotalCount 1
$parts = $line -split "\s+"
$expect = $parts[0]
$actual = (Get-FileHash $DumpPath -Algorithm SHA256).Hash
if ($expect -ne $actual) { throw "Checksum HATALI" }

if ($ServiceName) { Stop-Service -Name $ServiceName -ErrorAction SilentlyContinue }

& dropdb -h $Host -p $Port -U $User --if-exists $Db
& createdb -h $Host -p $Port -U $User $Db
& pg_restore -h $Host -p $Port -U $User -d $Db -c $DumpPath

if ($ServiceName) { Start-Service -Name $ServiceName }
Write-Output "Restore OK -> $Db"
