$BASE = "http://localhost:3000"
$pass = 0
$fail = 0
$results = @()

function Test-Route {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Body,
        [int]$ExpectedStatus,
        [string[]]$MustNotContain,
        [string[]]$MustContain,
        [string[]]$ExtraHeaders
    )

    $curlArgs = @("-s", "-o", "-", "-w", "`n%{http_code}", "-X", $Method)
    if ($Body) {
        $curlArgs += @("-H", "Content-Type: application/json", "-d", $Body)
    }
    if ($ExtraHeaders) {
        foreach ($h in $ExtraHeaders) {
            $curlArgs += @("-H", $h)
        }
    }
    $curlArgs += $Url

    try {
        $raw = & curl.exe @curlArgs 2>$null
        $lines = $raw -split "`n"
        $status = [int]($lines[-1].Trim())
        $content = ($lines[0..($lines.Length-2)] -join "`n")

        $ok = $true
        $notes = @()

        if ($status -ne $ExpectedStatus) {
            $ok = $false
            $notes += "Expected $ExpectedStatus got $status"
        }

        if ($MustContain) {
            foreach ($mc in $MustContain) {
                if ($content -notlike "*$mc*") {
                    $ok = $false
                    $notes += "Missing: $mc"
                }
            }
        }

        if ($MustNotContain) {
            foreach ($mnc in $MustNotContain) {
                if ($content -like "*$mnc*") {
                    $ok = $false
                    $notes += "LEAK: $mnc"
                }
            }
        }

        # Global secret scan
        $secretPatterns = @("ntn_", "AQ.Ab", "NOTION_TOKEN", "RAZORPAY_KEY_SECRET", "WHATSAPP_TOKEN", "breezyair_secret", "skLzsNcM")
        foreach ($sp in $secretPatterns) {
            if ($content -like "*$sp*") {
                $ok = $false
                $notes += "SECRET LEAK: $sp"
            }
        }

        if ($ok) {
            Write-Host "  PASS  $Name" -ForegroundColor Green
            $script:pass++
        } else {
            $noteStr = $notes -join "; "
            Write-Host "  FAIL  $Name -- $noteStr" -ForegroundColor Red
            $script:fail++
        }

        $script:results += [PSCustomObject]@{
            Test = $Name
            Result = if ($ok) { "PASS" } else { "FAIL" }
            HTTP = $status
            Notes = ($notes -join "; ")
        }
    }
    catch {
        $errMsg = $_.Exception.Message
        Write-Host "  FAIL  $Name -- Exception: $errMsg" -ForegroundColor Red
        $script:fail++
        $script:results += [PSCustomObject]@{
            Test = $Name
            Result = "FAIL"
            HTTP = "ERR"
            Notes = $errMsg
        }
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  BREEZYAIR SMOKE TEST ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. STATIC PAGES
Write-Host "-- Static Pages --" -ForegroundColor Yellow
Test-Route -Name "GET / (Home)" -Method GET -Url "$BASE/" -ExpectedStatus 200 -MustContain @("Breezyair","hero-mascot")
Test-Route -Name "GET /services" -Method GET -Url "$BASE/services" -ExpectedStatus 200 -MustContain @("mascot-outdoor")
Test-Route -Name "GET /contact" -Method GET -Url "$BASE/contact" -ExpectedStatus 200 -MustContain @("Asad Khan")
Test-Route -Name "GET /about" -Method GET -Url "$BASE/about" -ExpectedStatus 200 -MustContain @("Asad Khan","asad-khan")
Test-Route -Name "GET /pricing" -Method GET -Url "$BASE/pricing" -ExpectedStatus 200 -MustContain @("499","AMC")
Test-Route -Name "GET /book" -Method GET -Url "$BASE/book" -ExpectedStatus 200 -MustContain @("Book")
Test-Route -Name "GET /b2b" -Method GET -Url "$BASE/b2b" -ExpectedStatus 200 -MustContain @("b2b")
Test-Route -Name "GET /blog" -Method GET -Url "$BASE/blog" -ExpectedStatus 200 -MustContain @("blog")

# 2. SEO FILES
Write-Host ""
Write-Host "-- SEO and Infrastructure --" -ForegroundColor Yellow
Test-Route -Name "GET /sitemap.xml" -Method GET -Url "$BASE/sitemap.xml" -ExpectedStatus 200 -MustContain @("breezyair.co")
Test-Route -Name "GET /robots.txt" -Method GET -Url "$BASE/robots.txt" -ExpectedStatus 200 -MustContain @("Sitemap")
Test-Route -Name "GET /llms.txt" -Method GET -Url "$BASE/llms.txt" -ExpectedStatus 200 -MustContain @("Breezyair")
Test-Route -Name "GET /404 page" -Method GET -Url "$BASE/nonexistent-page-xyz" -ExpectedStatus 404

# 3. ENQUIRY API
Write-Host ""
Write-Host "-- Enquiry API --" -ForegroundColor Yellow
Test-Route -Name "Enquiry: footer callback" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"footer","phone":"9876543210"}' -ExpectedStatus 200 -MustContain @("success","leadId")
Test-Route -Name "Enquiry: contact form" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"contact","name":"Test User","phone":"9876543210","email":"test@example.com","locality":"Koramangala","issueType":"AC not cooling","urgency":"Normal"}' -ExpectedStatus 200 -MustContain @("success","leadId")
Test-Route -Name "Enquiry: booking with slot" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"booking","name":"Booking Test","phone":"9876543211","locality":"HSR Layout","issueType":"Deep clean","slotDate":"2026-07-25","slotTime":"morning","service":"wet-clean","amount":899}' -ExpectedStatus 200 -MustContain @("success","leadId","bookingId")
Test-Route -Name "Enquiry: B2B form" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"b2b","name":"B2B Contact","phone":"9876543212","email":"corp@example.com","company":"Acme Corp","businessType":"Office","units":20,"issueType":"Annual contract"}' -ExpectedStatus 200 -MustContain @("success","b2bLeadId")
Test-Route -Name "Enquiry: AMC booking" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"booking","name":"AMC Test","phone":"9876543213","locality":"Indiranagar","issueType":"AMC signup","slotDate":"2026-07-25","slotTime":"afternoon","service":"amc-bengaluru-cool","amount":2999,"acCount":2}' -ExpectedStatus 200 -MustContain @("success","contractId")
Test-Route -Name "Enquiry: honeypot triggered" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"contact","phone":"9876543214","honeyPot":"i am a bot"}' -ExpectedStatus 200 -MustContain @("success","stub_spam")
Test-Route -Name "Enquiry: validation (no phone)" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"contact","name":"No Phone"}' -ExpectedStatus 400 -MustContain @("error")
Test-Route -Name "Enquiry: invalid type" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"invalid","phone":"9876543215"}' -ExpectedStatus 400 -MustContain @("error")
Test-Route -Name "Enquiry: invalid email" -Method POST -Url "$BASE/api/enquiry" -Body '{"type":"contact","phone":"9876543216","email":"not-an-email"}' -ExpectedStatus 400 -MustContain @("error")

# 4. PAYMENT API
Write-Host ""
Write-Host "-- Payment API --" -ForegroundColor Yellow
Test-Route -Name "Payment: create-order no keys (503)" -Method POST -Url "$BASE/api/payment/create-order" -Body '{"amount":899,"description":"Test"}' -ExpectedStatus 503 -MustContain @("not configured") -MustNotContain @("RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET")
Test-Route -Name "Payment: verify no keys (503)" -Method POST -Url "$BASE/api/payment/verify" -Body '{"razorpay_order_id":"order_test","razorpay_payment_id":"pay_test","razorpay_signature":"sig_test"}' -ExpectedStatus 503 -MustContain @("not configured") -MustNotContain @("RAZORPAY_KEY_SECRET")

# 5. CHAT AGENT
Write-Host ""
Write-Host "-- Chat Agent --" -ForegroundColor Yellow
Test-Route -Name "Chat: send message" -Method POST -Url "$BASE/api/agent/breezy" -Body '{"messages":[{"role":"user","content":"hi","parts":[{"type":"text","text":"hi my AC is not cooling"}]}]}' -ExpectedStatus 200 -MustNotContain @("GOOGLE_GENERATIVE_AI_API_KEY","ntn_")

# 6. CARE CRON
Write-Host ""
Write-Host "-- Care Cron --" -ForegroundColor Yellow
Test-Route -Name "Care cron: no auth (401)" -Method GET -Url "$BASE/api/agent/care/run" -ExpectedStatus 401 -MustContain @("Unauthorized") -MustNotContain @("breezyair_secret")
Test-Route -Name "Care cron: wrong auth (401)" -Method GET -Url "$BASE/api/agent/care/run" -ExpectedStatus 401 -MustContain @("Unauthorized") -ExtraHeaders @("Authorization: Bearer wrong_secret")
Test-Route -Name "Care cron: valid auth (200)" -Method GET -Url "$BASE/api/agent/care/run" -ExpectedStatus 200 -MustContain @("ok") -ExtraHeaders @("Authorization: Bearer breezyair_secret_cron_secure_key_12345")

# 7. CARE FEEDBACK
Write-Host ""
Write-Host "-- Care Feedback --" -ForegroundColor Yellow
Test-Route -Name "Feedback: valid" -Method POST -Url "$BASE/api/agent/care/feedback" -Body '{"phone":"9876543210","rating":"yes"}' -ExpectedStatus 200 -MustContain @("saved")
Test-Route -Name "Feedback: missing fields" -Method POST -Url "$BASE/api/agent/care/feedback" -Body '{"phone":""}' -ExpectedStatus 400 -MustContain @("error")

# 8. VOICE AGENT (PARKED)
Write-Host ""
Write-Host "-- Voice Agent --" -ForegroundColor Yellow
Test-Route -Name "Voice: POST parked (503)" -Method POST -Url "$BASE/api/agent/voice" -Body '{"transcript":"hello"}' -ExpectedStatus 503 -MustContain @("parked")
Test-Route -Name "Voice: GET status" -Method GET -Url "$BASE/api/agent/voice" -ExpectedStatus 200 -MustContain @("parked")

# 9. RATE LIMITING
Write-Host ""
Write-Host "-- Rate Limiting --" -ForegroundColor Yellow
$rlOk = $true
for ($i = 1; $i -le 8; $i++) {
    $raw = curl.exe -s -o - -w "`n%{http_code}" -X POST -H "Content-Type: application/json" -d '{"type":"footer","phone":"5555555555"}' "$BASE/api/enquiry" 2>$null
    $code = ($raw -split "`n")[-1].Trim()
    if ($i -ge 6 -and $code -ne "429") { $rlOk = $false }
}
if ($rlOk) {
    Write-Host "  PASS  Rate limit (enquiry) kicks in after 5 reqs" -ForegroundColor Green
    $pass++
    $results += [PSCustomObject]@{ Test="Rate limit (enquiry)"; Result="PASS"; HTTP=429; Notes="" }
} else {
    Write-Host "  FAIL  Rate limit (enquiry) did NOT trigger" -ForegroundColor Red
    $fail++
    $results += [PSCustomObject]@{ Test="Rate limit (enquiry)"; Result="FAIL"; HTTP="200"; Notes="Expected 429 after 5 reqs" }
}

# 10. DATA LEAK SCAN ON ERROR PATHS
Write-Host ""
Write-Host "-- Data Leak Scan (Error Paths) --" -ForegroundColor Yellow
Test-Route -Name "Leak: malformed JSON" -Method POST -Url "$BASE/api/enquiry" -Body "not json" -ExpectedStatus 500 -MustNotContain @("NOTION_TOKEN","node_modules","at Object")
Test-Route -Name "Leak: empty body to payment" -Method POST -Url "$BASE/api/payment/create-order" -Body '{}' -ExpectedStatus 503 -MustNotContain @("RAZORPAY_KEY_ID","RAZORPAY_KEY_SECRET")

# RESULTS SUMMARY
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
$color = if ($fail -eq 0) { "Green" } else { "Red" }
Write-Host "  RESULTS: $pass PASSED, $fail FAILED" -ForegroundColor $color
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$failures = $results | Where-Object { $_.Result -eq "FAIL" }
if ($failures) {
    Write-Host "FAILURES:" -ForegroundColor Red
    $failures | Format-Table -AutoSize
}

Write-Host "FULL RESULTS:" -ForegroundColor Yellow
$results | Format-Table -AutoSize
