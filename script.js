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

let currentHashtags = []

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
    warningsList.innerHTML = '<li class="success">✅ Looks strong—no critical issues detected.</li>'
  } else {
    warnings.forEach((warning) => {
      const li = document.createElement("li")
      li.textContent = warning
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
    titleBreakdownList.appendChild(li)
  })

  titleSuggestionsList.innerHTML = ""
  if (suggestions.length === 0) {
    titleSuggestionsList.innerHTML = "<li>Excellent work. Your title checks all score factors.</li>"
    return
  }

  suggestions.forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item
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
    const item = document.createElement("span")
    item.className = "hashtag-chip"
    item.textContent = tag
    hashtagList.appendChild(item)
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
  } catch {
    copyHashtagsStatus.textContent = "Copy failed. Select and copy manually."
  }
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
