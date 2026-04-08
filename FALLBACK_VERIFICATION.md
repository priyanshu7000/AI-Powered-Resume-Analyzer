# ✅ Fallback Implementation Verification Checklist

## Step 1: Verify Environment Configuration
- [ ] Check `.env` file in `server/` folder
- [ ] Confirm `GROQ_API_KEY` is set
- [ ] Confirm `GEMINI_API_KEY` is set
- [ ] Both APIs should be configured for maximum reliability

**Command to check:**
```bash
cd server
echo GROQ_API_KEY=$GROQ_API_KEY
echo GEMINI_API_KEY=$GEMINI_API_KEY
```

---

## Step 2: Start the Server with Logging Enabled

Start your development server:
```bash
cd server
npm run dev
```

You should see the server starting with no errors.

---

## Step 3: Test Resume Analysis with Fallback Logs

1. **Open your application** (typically `http://localhost:5173`)
2. **Upload a test resume** (PDF file)
3. **Click "Analyze Resume"**
4. **Watch the server logs** for these messages:

### Success Case (Groq Works)
```
[AI Analysis] Attempting: Groq API
[AI Analysis] Using Groq API for: Resume Analysis
[Groq] Sending request...
[Groq] Response received, parsing...
[Groq] Analysis parsed successfully
[AI Analysis] ✓ Groq succeeded
```

### Fallback Case (Groq Fails → Gemini)
```
[AI Analysis] Attempting: Groq API
[Groq] Sending request...
[AI Analysis] ✗ Groq failed: [error message]
[AI Analysis] Full Groq error: [detailed error]
[AI Analysis] Attempting: Gemini API (fallback)
[AI Analysis] Using Gemini API for: Resume Analysis - Groq failed
[Gemini] Sending request...
[Gemini] Response received, parsing...
[Gemini] Analysis parsed successfully
[AI Analysis] ✓ Gemini succeeded
```

---

## Step 4: Test Job Matching with Fallback

1. **Go to Job Matcher page**
2. **Select a resume**
3. **Paste a job description**
4. **Click "Match with Resume"**
5. **Watch server logs** for Job Matching messages:

```
[Job Matching] Attempting: Groq API
[Groq - Matching] Sending request...
[Groq - Matching] Response received, parsing...
[Groq - Matching] Match parsed successfully
[Job Matching] ✓ Groq succeeded
```

---

## Step 5: Check Frontend Works Correctly

After analysis/matching, verify:
- [ ] ATS Score displays
- [ ] Skills section shows correctly
- [ ] Missing skills appear
- [ ] Suggestions are listed
- [ ] No error messages on screen

---

## Troubleshooting

### Problem: "Both Groq and Gemini failed" Error

**Check 1: API Keys**
```bash
# Verify keys are set
echo "GROQ_API_KEY: $GROQ_API_KEY"
echo "GEMINI_API_KEY: $GEMINI_API_KEY"
```

**Check 2: API Key Validity**
- Test Groq: https://console.groq.com
- Test Gemini: https://makersuite.google.com/app/apikey

**Check 3: Server Logs**
Look for specific error messages:
```
[Groq] Error: Invalid API key
[Gemini] Error: Network timeout
```

### Problem: Only One API Key Set

**Current Behavior:**
- If only Groq set → Falls back to Groq error
- If only Gemini set → Falls back to Gemini error
- **Recommended:** Set BOTH for reliability

### Problem: Slow Response

Check logs to see which API is being used:
```
✓ Groq succeeded     # ~1-3 seconds
✓ Gemini succeeded   # ~1-5 seconds
```

If using fallback (Gemini), it will be slightly slower due to retry.

---

## Performance Expectations

| Scenario | Expected Time | API Used |
|----------|--------------|----------|
| Both available, Groq works | 1-3 sec | Groq |
| Both available, Groq fails | 3-8 sec | Groq (fail) + Gemini |
| Only Gemini available | 1-5 sec | Gemini |
| Both fail | Error immediately | N/A |

---

## Log Parsing Guide

### To find all API calls:
```bash
# On macOS/Linux
grep -E "\[AI Analysis\]|\[Job Matching\]|\[Groq\]|\[Gemini\]" server.log

# On Windows (PowerShell)
Select-String -Pattern "\[AI Analysis\]|\[Job Matching\]|\[Groq\]|\[Gemini\]" server.log
```

### To find failures:
```bash
grep "failed\|Error\|✗" server.log
```

### To find successes:
```bash
grep "succeeded\|✓" server.log
```

---

## Summary

✅ **Enhanced Fallback System:**
- Groq is primary (fast, unlimited free)
- Gemini is fallback (fast, limited free)
- Automatic switching on failure
- Detailed logging for troubleshooting
- Works with resume analysis & job matching

✅ **Ready to Use:**
- Set both API keys in `.env`
- Upload a resume
- Click analyze
- Watch the logs!

---

**Status:** ✅ Ready to test  
**Next Steps:** Upload a resume and verify the fallback works with the logs above
