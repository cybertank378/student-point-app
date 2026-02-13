function Get-CleanTree {
    param (
        [string]$Path = ".",
        [string[]]$Exclude = @("node_modules",".idea", ".next", ".git", "coverage", "prisma", "test-results", "generated"),
        [int]$Depth = 20,
        [string]$Indent = ""
    )

    $items = Get-ChildItem -Path $Path -Force | Where-Object { $_.Name -notin $Exclude }

    foreach ($item in $items) {
        Write-Output "$Indent├── $($item.Name)"
        if ($item.PSIsContainer -and $Depth -gt 0) {
            Get-CleanTree -Path $item.FullName -Exclude $Exclude -Depth ($Depth - 1) -Indent "$Indent│   "
        }
    }
}

Get-CleanTree | Out-File clean-tree.txt
