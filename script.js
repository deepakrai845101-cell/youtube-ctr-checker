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

// Allow Enter key to trigger analysis
videoTitleInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

thumbnailTextInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

const revenueInputs = [viewsInput, clicksInput, cpmInput, rpmInput]
revenueInputs.forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateRevenueMetrics()
  })
})

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
