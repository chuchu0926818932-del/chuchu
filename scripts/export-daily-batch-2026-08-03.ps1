$ErrorActionPreference = "Stop"

$outputWorkbook = "C:\Users\USER\Desktop\短影音文案\源源不絕主題庫\SNL_每日新增短影音主題庫_2026-08-03.xlsx"
$dataPath = "C:\Users\USER\AppData\Local\Temp\daily-topics-2026-08-03.json"
$sheetName = "每日新增_2026-08-03"

if (Test-Path -LiteralPath $outputWorkbook) { throw "Refusing to overwrite an existing workbook: $outputWorkbook" }

$topics = Get-Content -Raw -Encoding utf8 -LiteralPath $dataPath | ConvertFrom-Json
if ($topics.Count -ne 30) { throw "Expected 30 topics, got $($topics.Count)." }

$headers = @("ID", "分類", "外層版型", "內容型態", "標題", "Hook", "場景", "共感", "白話拆解", "低門檻選擇", "轉念", "單一 CTA", "風險", "檢核", "故事線", "故事元素", "三層設計")
$required = @("id", "category", "formula", "contentType", "title", "hook", "scene", "empathy", "explain", "action", "reframe", "singleCta", "risk", "check", "storyline", "storyElements", "threeLayer")
foreach ($topic in $topics) { foreach ($field in $required) { if ([string]::IsNullOrWhiteSpace([string]$topic.$field)) { throw "$($topic.id) is missing $field." } } }

$excel = $null
$workbook = $null
$sheet = $null
try {
  $excel = New-Object -ComObject Excel.Application
  $excel.Visible = $false
  $excel.DisplayAlerts = $false
  $workbook = $excel.Workbooks.Add()
  $sheet = $workbook.Worksheets.Item(1)
  $sheet.Name = $sheetName
  $sheet.DisplayPageBreaks = $false
  $sheet.Application.ActiveWindow.DisplayGridlines = $false
  for ($column = 0; $column -lt $headers.Count; $column++) { $sheet.Cells.Item(1, $column + 1).Value2 = $headers[$column] }
  $headerRange = $sheet.Range($sheet.Cells.Item(1, 1), $sheet.Cells.Item(1, $headers.Count))
  $headerRange.Font.Bold = $true
  $headerRange.Font.Color = 16777215
  $headerRange.Interior.Color = 6697728
  $headerRange.HorizontalAlignment = -4108
  $headerRange.VerticalAlignment = -4108
  $headerRange.WrapText = $true
  $headerRange.RowHeight = 30
  for ($row = 0; $row -lt $topics.Count; $row++) {
    $topic = $topics[$row]
    $values = @($topic.id, $topic.category, $topic.formula, $topic.contentType, $topic.title, $topic.hook, $topic.scene, $topic.empathy, $topic.explain, $topic.action, $topic.reframe, $topic.singleCta, $topic.risk, $topic.check, $topic.storyline, $topic.storyElements, $topic.threeLayer)
    for ($column = 0; $column -lt $values.Count; $column++) { $sheet.Cells.Item($row + 2, $column + 1).Value2 = [string]$values[$column] }
  }
  $dataRange = $sheet.Range($sheet.Cells.Item(1, 1), $sheet.Cells.Item($topics.Count + 1, $headers.Count))
  $dataRange.WrapText = $true
  $dataRange.VerticalAlignment = -4160
  $dataRange.Borders.LineStyle = 1
  $dataRange.Borders.Color = 14277081
  for ($row = 2; $row -le $topics.Count + 1; $row++) { $sheet.Rows.Item($row).RowHeight = 78 }
  $widths = @(16, 14, 18, 20, 26, 38, 38, 42, 42, 42, 34, 18, 28, 34, 48, 48, 48)
  for ($column = 0; $column -lt $widths.Count; $column++) { $sheet.Columns.Item($column + 1).ColumnWidth = $widths[$column] }
  $table = $sheet.ListObjects.Add(1, $dataRange, $null, 1)
  $table.Name = "DailyTopics20260803"
  $table.TableStyle = "TableStyleMedium2"
  $sheet.Range("A2").Select()
  $excel.ActiveWindow.FreezePanes = $true
  $workbook.SaveAs($outputWorkbook, 51)
  $workbook.Close($true)
  $workbook = $null
  [pscustomobject]@{ outputPath = $outputWorkbook; sheet = $sheetName; count = $topics.Count } | ConvertTo-Json -Compress
}
finally {
  if ($workbook) { $workbook.Close($false) }
  if ($excel) { $excel.Quit() }
  if ($sheet) { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($sheet) }
  if ($workbook) { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) }
  if ($excel) { [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excel) }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}
