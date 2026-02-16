// DOM Elements
const videoTitleInput = document.getElementById("videoTitle")
const thumbnailTextInput = document.getElementById("thumbnailText")
const analyzeBtn = document.getElementById("analyzeBtn")
const resultsSection = document.getElementById("resultsSection")
const titleCount = document.getElementById("titleCount")
const thumbnailCount = document.getElementById("thumbnailCount")
const viewsInput = document.getElementById("viewsInput")
const clicksInput = document.getElementById("clicksInput")
const cpmInput = document.getElementById("cpmInput")
const rpmInput = document.getElementById("rpmInput")
const calculateRevenueBtn = document.getElementById("calculateRevenueBtn")
const revenueResults = document.getElementById("revenueResults")
const ctrValue = document.getElementById("ctrValue")
const estimatedRpmValue = document.getElementById("estimatedRpmValue")
const cpmEarningsValue = document.getElementById("cpmEarningsValue")
const rpmEarningsValue = document.getElementById("rpmEarningsValue")
const rpmNote = document.getElementById("rpmNote")
const thumbnailUpload = document.getElementById("thumbnailUpload")
const thumbnailPreviewWrap = document.getElementById("thumbnailPreviewWrap")
const thumbnailPreview = document.getElementById("thumbnailPreview")
const thumbnailChecklistInputs = document.querySelectorAll("#thumbnailChecklist input[type='checkbox']")
const thumbnailTips = document.getElementById("thumbnailTips")
const titleCheckerInput = document.getElementById("titleCheckerInput")
const checkTitleScoreBtn = document.getElementById("checkTitleScoreBtn")
const titleCheckerResults = document.getElementById("titleCheckerResults")
const titleScoreValue = document.getElementById("titleScoreValue")
const titleScoreSummary = document.getElementById("titleScoreSummary")
const titleBreakdownList = document.getElementById("titleBreakdownList")
const titleSuggestionsList = document.getElementById("titleSuggestionsList")
const hashtagTopicInput = document.getElementById("hashtagTopicInput")
const generateHashtagsBtn = document.getElementById("generateHashtagsBtn")
const hashtagResults = document.getElementById("hashtagResults")
const hashtagList = document.getElementById("hashtagList")
const copyHashtagsBtn = document.getElementById("copyHashtagsBtn")
const copyHashtagsStatus = document.getElementById("copyHashtagsStatus")
const descriptionTitleInput = document.getElementById("descriptionTitleInput")
const descriptionKeywordInput = document.getElementById("descriptionKeywordInput")
const descriptionSummaryInput = document.getElementById("descriptionSummaryInput")
const generateDescriptionBtn = document.getElementById("generateDescriptionBtn")
const descriptionResults = document.getElementById("descriptionResults")
const descriptionOutput = document.getElementById("descriptionOutput")
const copyDescriptionBtn = document.getElementById("copyDescriptionBtn")
const copyDescriptionStatus = document.getElementById("copyDescriptionStatus")
const themeToggle = document.getElementById("themeToggle")
const copyToast = document.getElementById("copyToast")

const THEME_STORAGE_KEY = "preferredTheme"

let currentHashtags = []
let currentDescription = ""
let copyToastTimeoutId

// Results elements
const scoreNumber = document.getElementById("scoreNumber")
const scoreFill = document.getElementById("scoreFill")
const scoreDescription = document.getElementById("scoreDescription")
const warningsList = document.getElementById("warningsList")
const warningsCard = document.getElementById("warningsCard")
const suggestionsList = document.getElementById("suggestionsList")
const verdictCard = document.getElementById("verdictCard")
const verdictIcon = document.getElementById("verdictIcon")
const verdictTitle = document.getElementById("verdictTitle")
const verdictMessage = document.getElementById("verdictMessage")

// Clickbait/Overused words list
const clickbaitWords = [
  "shocking",
  "shocked",
  "you wont believe",
  "you won't believe",
  "must watch",
  "secret",
  "secrets",
  "viral",
  "exposed",
  "expose",
  "truth",
  "insane",
  "crazy",
  "unbelievable",
  "amazing",
  "incredible",
  "mind blowing",
  "life changing",
  "game changer",
  "must see",
]

// Power/emotion words for positive scoring
const powerWords = [
  "proven",
  "ultimate",
  "complete",
  "essential",
  "powerful",
  "effective",
  "simple",
  "easy",
  "quick",
  "fast",
  "best",
  "perfect",
  "mistake",
  "fail",
  "why",
  "how",
  "what",
  "when",
  "tried",
  "tested",
  "real",
  "honest",
]

const emotionalWords = [
  "surprising",
  "surprised",
  "shocking",
  "proven",
  "warning",
  "mistake",
  "mistakes",
  "secret",
  "fear",
  "amazing",
  "simple",
  "easy",
  "powerful",
  "essential",
  "urgent",
  "fail",
  "failed",
  "success",
  "breakthrough",
]


const topicStopWords = new Set([
  "a",
  "an",
  "and",
  "for",
  "the",
  "to",
  "of",
  "in",
  "on",
  "with",
  "how",
  "your",
  "my",
  "from",
  "by",
])

// Title templates for suggestions
function applyTheme(theme) {
  const isDark = theme === "dark"
  document.body.classList.toggle("theme-dark", isDark)

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark))
    themeToggle.setAttribute("aria-label", isDark ? "Enable light mode" : "Enable dark mode")
    themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode"
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme)
    return
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  applyTheme(prefersDark ? "dark" : "light")
}

function toggleTheme() {
  const isDark = document.body.classList.contains("theme-dark")
  const nextTheme = isDark ? "light" : "dark"
  applyTheme(nextTheme)
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
}

const titleTemplates = [
  "I Tried [TOPIC] So You Don't Have To",
  "This Changed Everything About [TOPIC]",
  "Nobody Talks About This [TOPIC] Secret",
  "Before You [ACTION], Watch This",
  "The [TOPIC] Method That Actually Works",
  "What [EXPERTS] Don't Tell You About [TOPIC]",
  "I Spent [TIME] Learning [TOPIC] - Here's What I Found",
]

// Character count updates
videoTitleInput.addEventListener("input", (e) => {
  const length = e.target.value.length
  titleCount.textContent = `${length}/100 characters`
  if (length > 60) {
    titleCount.style.color = "#ff0000"
  } else {
    titleCount.style.color = "#606060"
  }
})

thumbnailTextInput.addEventListener("input", (e) => {
  const length = e.target.value.length
  thumbnailCount.textContent = `${length}/50 characters`
  const wordCount = e.target.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  if (wordCount > 4) {
    thumbnailCount.style.color = "#ff0000"
  } else {
    thumbnailCount.style.color = "#606060"
  }
})

// Analyze button click
analyzeBtn.addEventListener("click", analyzeContent)
calculateRevenueBtn.addEventListener("click", calculateRevenueMetrics)
checkTitleScoreBtn.addEventListener("click", checkTitleScore)
generateHashtagsBtn.addEventListener("click", generateHashtags)
copyHashtagsBtn.addEventListener("click", copyGeneratedHashtags)
generateDescriptionBtn.addEventListener("click", generateDescription)
copyDescriptionBtn.addEventListener("click", copyGeneratedDescription)
if (themeToggle) themeToggle.addEventListener("click", toggleTheme)

loadSavedTheme()

// Allow Enter key to trigger analysis
videoTitleInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

thumbnailTextInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

titleCheckerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkTitleScore()
})

hashtagTopicInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateHashtags()
})

const descriptionInputs = [descriptionTitleInput, descriptionKeywordInput, descriptionSummaryInput]
descriptionInputs.forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateDescription()
  })
})

const revenueInputs = [viewsInput, clicksInput, cpmInput, rpmInput]
revenueInputs.forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateRevenueMetrics()
  })
})

let thumbnailObjectUrl = ""

thumbnailUpload.addEventListener("change", handleThumbnailUpload)
thumbnailChecklistInputs.forEach((input) => {
  input.addEventListener("change", updateThumbnailTips)
})

function handleThumbnailUpload(event) {
  const [file] = event.target.files || []

  if (!file) {
    clearThumbnailPreview()
    return
  }

  if (thumbnailObjectUrl) {
    URL.revokeObjectURL(thumbnailObjectUrl)
  }

  thumbnailObjectUrl = URL.createObjectURL(file)
  thumbnailPreview.src = thumbnailObjectUrl
  thumbnailPreviewWrap.classList.remove("hidden")
  updateThumbnailTips()
}

function clearThumbnailPreview() {
  thumbnailPreview.removeAttribute("src")
  thumbnailPreviewWrap.classList.add("hidden")

  if (thumbnailObjectUrl) {
    URL.revokeObjectURL(thumbnailObjectUrl)
    thumbnailObjectUrl = ""
  }

  thumbnailTips.innerHTML = "<li>Upload a thumbnail and check each item to get tailored suggestions.</li>"
}

function updateThumbnailTips() {
  const pendingTips = []

  thumbnailChecklistInputs.forEach((input) => {
    if (!input.checked) {
      pendingTips.push(input.dataset.tip)
    }
  })

  thumbnailTips.innerHTML = ""

  if (pendingTips.length === 0) {
    thumbnailTips.innerHTML = "<li>Strong thumbnail fundamentals. You are ready to test this version.</li>"
    return
  }

  pendingTips.forEach((tip) => {
    const li = document.createElement("li")
    li.textContent = tip
    thumbnailTips.appendChild(li)
  })
}

function analyzeContent() {
  const title = videoTitleInput.value.trim()
  const thumbnail = thumbnailTextInput.value.trim()

  // Validation
  if (!title) {
    alert("Enter a video title to start analysis.")
    return
  }

  // Perform analysis
  const warnings = []
  let score = 0

  // A. Check for clickbait/overused words
  const clickbaitCount = countClickbaitWords(title, thumbnail)
  if (clickbaitCount > 1) {
    warnings.push(`Detected ${clickbaitCount} overused hype words. Use clearer, more credible wording.`)
  } else {
    score += 20
  }

  // B. Check title vs thumbnail repetition
  const repetitionPercent = calculateRepetition(title, thumbnail)
  if (repetitionPercent > 60 && thumbnail) {
    warnings.push(
      `${Math.round(repetitionPercent)}% copy overlap detected. Let your thumbnail add new context, not repeat the title.`,
    )
  } else if (thumbnail) {
    score += 20
  }

  // C. Length optimization
  if (title.length > 60) {
    warnings.push(`Title is ${title.length} characters. Keep it under 60 for stronger mobile visibility.`)
  } else if (title.length >= 30) {
    score += 20
  }

  const thumbnailWords = thumbnail
    ? thumbnail
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0)
    : []
  if (thumbnail && thumbnailWords.length > 4) {
    warnings.push(`Thumbnail has ${thumbnailWords.length} words. Keep it under 4 words for fast readability.`)
  } else if (thumbnail && thumbnailWords.length > 0) {
    score += 20
  }

  // D. Check for power words
  if (hasPowerWords(title)) {
    score += 20
  }

  // Check for questions or contrast
  if (hasQuestionOrContrast(title)) {
    score += 20
  }

  // Display results
  displayResults(score, warnings, title, thumbnail)

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
}

function countClickbaitWords(title, thumbnail) {
  const combined = (title + " " + thumbnail).toLowerCase()
  let count = 0
  clickbaitWords.forEach((word) => {
    if (combined.includes(word.toLowerCase())) {
      count++
    }
  })
  return count
}

function calculateRepetition(title, thumbnail) {
  if (!thumbnail) return 0

  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
  const thumbnailWords = thumbnail
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)

  if (thumbnailWords.length === 0) return 0

  let matchCount = 0
  thumbnailWords.forEach((word) => {
    if (titleWords.includes(word)) {
      matchCount++
    }
  })

  return (matchCount / thumbnailWords.length) * 100
}

function hasPowerWords(text) {
  const lowerText = text.toLowerCase()
  return powerWords.some((word) => lowerText.includes(word))
}

function hasQuestionOrContrast(text) {
  // Check for questions
  if (text.includes("?")) return true

  // Check for contrast words
  const contrastWords = ["but", "however", "vs", "versus", "before", "after", "without"]
  const lowerText = text.toLowerCase()
  return contrastWords.some((word) => lowerText.includes(word))
}

function displayResults(score, warnings, title, thumbnail) {
  // Show results section
  resultsSection.classList.remove("hidden")

  // Animate score
  animateScore(score)

  // Display score description
  if (score <= 40) {
    scoreDescription.textContent = "Your packaging needs stronger clarity and positioning before publish."
    scoreFill.className = "score-fill low"
  } else if (score <= 70) {
    scoreDescription.textContent = "Strong foundation. A few refinements can meaningfully improve click-through rate."
    scoreFill.className = "score-fill medium"
  } else {
    scoreDescription.textContent = "Excellent. Your title and thumbnail are well-positioned for strong CTR performance."
    scoreFill.className = "score-fill high"
  }

  // Display warnings
  warningsList.innerHTML = ""
  if (warnings.length === 0) {
    const successText = "✅ Looks strong—no critical issues detected."
    const li = document.createElement("li")
    li.className = "success"
    li.textContent = successText
    li.appendChild(createResultCopyButton(successText, "Copy fix note"))
    warningsList.appendChild(li)
  } else {
    warnings.forEach((warning) => {
      const li = document.createElement("li")
      li.textContent = warning
      li.appendChild(createResultCopyButton(warning, "Copy fix note"))
      warningsList.appendChild(li)
    })
  }

  // Generate suggestions
  generateSuggestions(title, thumbnail)

  // Display verdict
  displayVerdict(score)
}

function animateScore(targetScore) {
  let currentScore = 0
  const duration = 1000 // 1 second
  const increment = targetScore / (duration / 16) // 60fps

  const animation = setInterval(() => {
    currentScore += increment
    if (currentScore >= targetScore) {
      currentScore = targetScore
      clearInterval(animation)
    }
    scoreNumber.textContent = Math.round(currentScore)
    scoreFill.style.width = currentScore + "%"
  }, 16)
}

function generateSuggestions(title, thumbnail) {
  suggestionsList.innerHTML = ""

  // Extract key topic from title
  const words = title.split(" ").filter((w) => w.length > 3)
  const topic = words.length > 0 ? words[0] : "Your Topic"

  // Generate 3 suggestions
  const selectedTemplates = titleTemplates.slice(0, 3)

  selectedTemplates.forEach((template, index) => {
    const suggestion = template
      .replace("[TOPIC]", topic)
      .replace("[ACTION]", "Start")
      .replace("[TIME]", "30 Days")
      .replace("[EXPERTS]", "Most People")

    const div = document.createElement("div")
    div.className = "suggestion-item"
    div.style.animationDelay = `${index * 0.1}s`

    div.innerHTML = `
            <div class="suggestion-label">Template ${index + 1}</div>
            <div class="suggestion-text">${suggestion}</div>
        `
    div.appendChild(createResultCopyButton(suggestion, `Copy template ${index + 1}`))

    suggestionsList.appendChild(div)
  })

  // Add custom suggestion based on current content
  const customDiv = document.createElement("div")
  customDiv.className = "suggestion-item"
  customDiv.style.animationDelay = "0.3s"

  let customSuggestion = "Make the promise in your title more specific and let the thumbnail highlight the payoff."
  if (thumbnail) {
    customSuggestion = `Try: "${title.substring(0, 40)}..." with thumbnail text that previews a clear result.`
  }

  customDiv.innerHTML = `
        <div class="suggestion-label">Strategic Tip</div>
        <div class="suggestion-text">${customSuggestion}</div>
    `
  customDiv.appendChild(createResultCopyButton(customSuggestion, "Copy custom suggestion"))

  suggestionsList.appendChild(customDiv)
}

function displayVerdict(score) {
  verdictCard.className = "card verdict-card"

  if (score <= 40) {
    verdictCard.classList.add("low")
    verdictIcon.textContent = "❌"
    verdictTitle.textContent = "Needs Revision"
    verdictMessage.textContent =
      "This combination may underperform. Apply the recommendations above before publishing."
  } else if (score <= 70) {
    verdictCard.classList.add("medium")
    verdictIcon.textContent = "⚠️"
    verdictTitle.textContent = "Promising with Edits"
    verdictMessage.textContent =
      "You are close. A few targeted edits can improve clarity and lift click-through rate."
  } else {
    verdictCard.classList.add("high")
    verdictIcon.textContent = "✅"
    verdictTitle.textContent = "Ready to Publish"
    verdictMessage.textContent =
      "Great work. This combination is clear, compelling, and ready for launch."
  }
}

function calculateRevenueMetrics() {
  const views = Number(viewsInput.value)
  const clicks = Number(clicksInput.value)
  const cpm = Number(cpmInput.value)
  const rpmRaw = rpmInput.value.trim()
  const hasCustomRpm = rpmRaw !== ""
  const rpm = hasCustomRpm ? Number(rpmRaw) : null

  if (!isValidNonNegative(views) || views <= 0) {
    alert("Please enter views greater than 0.")
    return
  }

  if (!isValidNonNegative(clicks)) {
    alert("Please enter valid clicks (0 or more).")
    return
  }

  if (clicks > views) {
    alert("Clicks cannot be greater than views.")
    return
  }

  if (!isValidNonNegative(cpm)) {
    alert("Please enter a valid CPM (0 or more).")
    return
  }

  if (hasCustomRpm && !isValidNonNegative(rpm)) {
    alert("Please enter a valid RPM (0 or more), or leave RPM empty.")
    return
  }

  const ctr = (clicks / views) * 100
  const estimatedRpm = hasCustomRpm ? rpm : cpm * 0.55
  const cpmEarnings = (views / 1000) * cpm
  const rpmEarnings = (views / 1000) * estimatedRpm

  ctrValue.textContent = `${ctr.toFixed(2)}%`
  estimatedRpmValue.textContent = formatCurrency(estimatedRpm)
  cpmEarningsValue.textContent = formatCurrency(cpmEarnings)
  rpmEarningsValue.textContent = formatCurrency(rpmEarnings)
  rpmNote.textContent = hasCustomRpm
    ? "Using your entered RPM to estimate creator earnings"
    : "Estimated from CPM with a default 55% creator share"

  revenueResults.classList.remove("hidden")
}

function checkTitleScore() {
  const title = titleCheckerInput.value.trim()

  if (!title) {
    alert("Please enter a title to score.")
    return
  }

  let score = 0
  const breakdown = []
  const suggestions = []

  const lengthPoints = scoreLength(title)
  score += lengthPoints
  breakdown.push(`Length: ${lengthPoints}/30`)
  if (lengthPoints < 30) {
    suggestions.push("Aim for 45-60 characters so the full title is easier to scan on mobile.")
  }

  const emotionalPoints = scoreEmotionalWords(title)
  score += emotionalPoints
  breakdown.push(`Emotional words: ${emotionalPoints}/20`)
  if (emotionalPoints < 20) {
    suggestions.push("Add one emotionally engaging word like 'mistake', 'warning', or 'surprising'.")
  }

  const numbersPoints = /\d/.test(title) ? 15 : 0
  score += numbersPoints
  breakdown.push(`Numbers usage: ${numbersPoints}/15`)
  if (numbersPoints === 0) {
    suggestions.push("Consider adding a number (e.g., 3, 7, 2026) to make the promise more specific.")
  }

  const powerWordPoints = scorePowerWords(title)
  score += powerWordPoints
  breakdown.push(`Power words: ${powerWordPoints}/20`)
  if (powerWordPoints < 20) {
    suggestions.push("Use a power word such as 'ultimate', 'proven', 'best', or 'complete'.")
  }

  const questionPoints = title.includes("?") ? 15 : 0
  score += questionPoints
  breakdown.push(`Question format: ${questionPoints}/15`)
  if (questionPoints === 0) {
    suggestions.push("Test a question-style title to trigger curiosity, like 'Why Is Your CTR Still Low?'.")
  }

  renderTitleScoreResults(score, breakdown, suggestions)
}

function scoreLength(title) {
  if (title.length >= 45 && title.length <= 60) return 30
  if (title.length >= 35 && title.length <= 70) return 20
  if (title.length >= 25 && title.length <= 80) return 10
  return 0
}

function scoreEmotionalWords(title) {
  const lowerTitle = title.toLowerCase()
  const matches = emotionalWords.filter((word) => lowerTitle.includes(word))
  if (matches.length >= 2) return 20
  if (matches.length === 1) return 12
  return 0
}

function scorePowerWords(title) {
  const lowerTitle = title.toLowerCase()
  const matches = powerWords.filter((word) => lowerTitle.includes(word))
  if (matches.length >= 2) return 20
  if (matches.length === 1) return 12
  return 0
}

function renderTitleScoreResults(score, breakdown, suggestions) {
  titleCheckerResults.classList.remove("hidden")
  titleScoreValue.textContent = score

  if (score >= 80) {
    titleScoreSummary.textContent = "Strong title foundation. Minor tweaks could make it even sharper."
  } else if (score >= 55) {
    titleScoreSummary.textContent = "Decent start. A few improvements could boost click potential."
  } else {
    titleScoreSummary.textContent = "Needs optimization. Use the suggestions below to improve this title."
  }

  titleBreakdownList.innerHTML = ""
  breakdown.forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item
    li.appendChild(createResultCopyButton(item, "Copy breakdown item"))
    titleBreakdownList.appendChild(li)
  })

  titleSuggestionsList.innerHTML = ""
  if (suggestions.length === 0) {
    const message = "Excellent work. Your title checks all score factors."
    const li = document.createElement("li")
    li.textContent = message
    li.appendChild(createResultCopyButton(message, "Copy suggestion"))
    titleSuggestionsList.appendChild(li)
    return
  }

  suggestions.forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item
    li.appendChild(createResultCopyButton(item, "Copy suggestion"))
    titleSuggestionsList.appendChild(li)
  })
}


function generateHashtags() {
  const topic = hashtagTopicInput.value.trim()

  if (!topic) {
    alert("Enter a topic to generate hashtags.")
    return
  }

  currentHashtags = buildHashtagSet(topic)
  renderHashtags(currentHashtags)
  copyHashtagsStatus.textContent = ""
}

function buildHashtagSet(topic) {
  const cleanedTopic = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const words = cleanedTopic.split(" ").filter((word) => word.length > 1)
  const filteredWords = words.filter((word) => !topicStopWords.has(word))
  const topicWords = filteredWords.length > 0 ? filteredWords : words

  const topicStem = topicWords.join("")
  const topicPrefix = topicWords.slice(0, 2).join("") || "youtube"

  const broadHighSearch = [
    "youtube",
    "youtubetips",
    "youtubegrowth",
    "contentcreator",
    "videoediting",
    "videomarketing",
    "socialmediatips",
    "creatorstrategy",
  ]

  const topicMediumSearch = [
    topicStem,
    `${topicStem}tips`,
    `${topicStem}tutorial`,
    `${topicStem}forbeginners`,
    `${topicStem}strategy`,
    `${topicPrefix}guide`,
    `${topicPrefix}channel`,
    `${topicPrefix}content`,
    `${topicStem}2026`,
  ]

  const uniqueHashtags = []
  const seen = new Set()

  ;[...topicMediumSearch, ...broadHighSearch].forEach((candidate) => {
    const tag = toHashtag(candidate)
    if (!tag || seen.has(tag)) return
    seen.add(tag)
    uniqueHashtags.push(tag)
  })

  const fallbackTags = ["youtubecreator", "viralvideo", "growthmindset", "contenttips", "youtubeshorts"]
  fallbackTags.forEach((candidate) => {
    const tag = toHashtag(candidate)
    if (!seen.has(tag) && uniqueHashtags.length < 15) {
      seen.add(tag)
      uniqueHashtags.push(tag)
    }
  })

  return uniqueHashtags.slice(0, 15)
}

function toHashtag(value) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (!cleaned) return ""
  return `#${cleaned}`
}

function renderHashtags(hashtags) {
  hashtagList.innerHTML = ""

  hashtags.forEach((tag) => {
    const row = document.createElement("div")
    row.className = "result-with-copy"

    const item = document.createElement("span")
    item.className = "hashtag-chip"
    item.textContent = tag

    row.appendChild(item)
    row.appendChild(createResultCopyButton(tag, `Copy ${tag}`))
    hashtagList.appendChild(row)
  })

  hashtagResults.classList.remove("hidden")
}

async function copyGeneratedHashtags() {
  if (currentHashtags.length === 0) {
    copyHashtagsStatus.textContent = "Generate hashtags first."
    return
  }

  const hashtagsLine = currentHashtags.join(" ")

  try {
    await navigator.clipboard.writeText(hashtagsLine)
    copyHashtagsStatus.textContent = "Copied!"
    showCopyToast("Hashtags copied")
  } catch {
    copyHashtagsStatus.textContent = "Copy failed. Select and copy manually."
  }
}

function generateDescription() {
  const videoTitle = descriptionTitleInput.value.trim()
  const mainKeyword = descriptionKeywordInput.value.trim()
  const shortSummary = descriptionSummaryInput.value.trim()

  if (!videoTitle || !mainKeyword || !shortSummary) {
    alert("Please fill in video title, main keyword, and short summary.")
    return
  }

  const normalizedKeyword = toTitleCase(mainKeyword)
  const ctaLines = [
    `👍 If this helped, like the video and subscribe for more ${mainKeyword} strategies.`,
    `💬 Comment your biggest challenge with ${mainKeyword} so I can cover it in the next upload.`,
  ]

  const hashtags = buildDescriptionHashtags(mainKeyword)
  const keywordParagraph = `This video is built for creators searching for ${mainKeyword}. If you want better results with ${mainKeyword}, use this framework step by step and apply it before your next upload for stronger click-through and audience growth.`

  currentDescription = [
    `${videoTitle}`,
    "",
    `SEO-Friendly Description:\n${shortSummary} In this guide, you will learn practical steps to apply ${mainKeyword} without guesswork so you can improve content packaging and reach the right viewers.`,
    "",
    `Keyword-Optimized Paragraph:\n${keywordParagraph}`,
    "",
    `CTA Lines:\n${ctaLines.join("\n")}`,
    "",
    `Hashtags:\n${hashtags.join(" ")}`,
  ].join("\n")

  descriptionOutput.value = currentDescription
  descriptionResults.classList.remove("hidden")
  copyDescriptionStatus.textContent = `${normalizedKeyword} description is ready to copy.`
}

function buildDescriptionHashtags(keyword) {
  const words = keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 1)

  const compact = words.join("") || "youtube"
  const prefix = words.slice(0, 2).join("") || compact

  return [
    toHashtag(compact),
    toHashtag(`${compact}tips`),
    toHashtag(`${compact}strategy`),
    toHashtag(`${prefix}guide`),
    "#youtubegrowth",
    "#contentcreator",
    "#youtubetips",
    "#videomarketing",
  ]
}

async function copyGeneratedDescription() {
  if (!currentDescription) {
    copyDescriptionStatus.textContent = "Generate description text first."
    return
  }

  try {
    await navigator.clipboard.writeText(currentDescription)
    copyDescriptionStatus.textContent = "Description copied!"
    showCopyToast("Description copied")
  } catch {
    copyDescriptionStatus.textContent = "Copy failed. Select and copy manually."
  }
}


function createResultCopyButton(value, ariaLabel) {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "result-copy-btn"
  button.textContent = "Copy"
  button.setAttribute("aria-label", ariaLabel)
  button.addEventListener("click", () => {
    copyResultValue(value)
  })
  return button
}

async function copyResultValue(value) {
  try {
    await navigator.clipboard.writeText(value)
    showCopyToast("Copied")
  } catch {
    showCopyToast("Copy failed")
  }
}

function showCopyToast(message) {
  if (!copyToast) return

  copyToast.textContent = message
  copyToast.classList.add("show")

  clearTimeout(copyToastTimeoutId)
  copyToastTimeoutId = setTimeout(() => {
    copyToast.classList.remove("show")
  }, 1400)
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function isValidNonNegative(value) {
  return Number.isFinite(value) && value >= 0
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
