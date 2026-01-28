param(
  [string]$OutDir = "D:\MTN_YEDEK",
  [string]$Db = "mtn_erp",
  [string]$Host = "localhost",
  [string]$Port = "5432",
  [string]$User = "postgres",
  [string]$Log = "D:\MTN_YEDEK\backup.log"
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }
$ts = Get-Date -Format "yyyy-MM-dd_HH-mm"
$dump = Join-Path $OutDir ("MTN_ERP_{0}.dump" -f $ts)
$sha  = $dump + ".sha256"

& pg_dump -h $Host -p $Port -U $User -F c -f $dump $Db
$hash = (Get-FileHash $dump -Algorithm SHA256).Hash
"$hash  $(Split-Path $dump -Leaf)" | Out-File -FilePath $sha -Encoding ASCII -NoNewline

"$((Get-Date).ToString('u')) OK $dump $hash" | Add-Content -Path $Log
Write-Output $dump
