// DOM Elements
const videoTitleInput = document.getElementById("videoTitle")
const thumbnailTextInput = document.getElementById("thumbnailText")
const analyzeBtn = document.getElementById("analyzeBtn")
const resultsSection = document.getElementById("resultsSection")
const titleCount = document.getElementById("titleCount")
const thumbnailCount = document.getElementById("thumbnailCount")

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

// Allow Enter key to trigger analysis
videoTitleInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

thumbnailTextInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") analyzeContent()
})

function analyzeContent() {
  const title = videoTitleInput.value.trim()
  const thumbnail = thumbnailTextInput.value.trim()

  // Validation
  if (!title) {
    alert("Please enter a video title")
    return
  }

  // Perform analysis
  const warnings = []
  let score = 0

  // A. Check for clickbait/overused words
  const clickbaitCount = countClickbaitWords(title, thumbnail)
  if (clickbaitCount > 1) {
    warnings.push(`Found ${clickbaitCount} overused clickbait words. Consider using more authentic language.`)
  } else {
    score += 20
  }

  // B. Check title vs thumbnail repetition
  const repetitionPercent = calculateRepetition(title, thumbnail)
  if (repetitionPercent > 60 && thumbnail) {
    warnings.push(
      `${Math.round(repetitionPercent)}% word repetition detected. Thumbnail should add curiosity, not repeat the title.`,
    )
  } else if (thumbnail) {
    score += 20
  }

  // C. Length optimization
  if (title.length > 60) {
    warnings.push(`Title is ${title.length} characters. Keep it under 60 for better visibility on mobile.`)
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
    warnings.push(`Thumbnail has ${thumbnailWords.length} words. Keep it under 4 words for better readability.`)
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
    scoreDescription.textContent = "Your title and thumbnail need significant improvement to boost CTR."
    scoreFill.className = "score-fill low"
  } else if (score <= 70) {
    scoreDescription.textContent = "Good foundation, but there's room for optimization to maximize CTR."
    scoreFill.className = "score-fill medium"
  } else {
    scoreDescription.textContent = "Excellent! Your title and thumbnail are optimized for high CTR."
    scoreFill.className = "score-fill high"
  }

  // Display warnings
  warningsList.innerHTML = ""
  if (warnings.length === 0) {
    warningsList.innerHTML = '<li class="success">✅ No major issues detected!</li>'
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
            <div class="suggestion-label">Option ${index + 1}</div>
            <div class="suggestion-text">${suggestion}</div>
        `

    suggestionsList.appendChild(div)
  })

  // Add custom suggestion based on current content
  const customDiv = document.createElement("div")
  customDiv.className = "suggestion-item"
  customDiv.style.animationDelay = "0.3s"

  let customSuggestion = "Try making your title more specific and your thumbnail more curiosity-driven."
  if (thumbnail) {
    customSuggestion = `Consider: "${title.substring(0, 40)}..." with thumbnail text that teases a result or transformation.`
  }

  customDiv.innerHTML = `
        <div class="suggestion-label">Custom Tip</div>
        <div class="suggestion-text">${customSuggestion}</div>
    `

  suggestionsList.appendChild(customDiv)
}

function displayVerdict(score) {
  verdictCard.className = "card verdict-card"

  if (score <= 40) {
    verdictCard.classList.add("low")
    verdictIcon.textContent = "❌"
    verdictTitle.textContent = "Low CTR Risk"
    verdictMessage.textContent =
      "This title and thumbnail combination likely won't perform well. Consider the suggestions above to improve your CTR."
  } else if (score <= 70) {
    verdictCard.classList.add("medium")
    verdictIcon.textContent = "⚠️"
    verdictTitle.textContent = "Medium CTR Potential"
    verdictMessage.textContent =
      "You're on the right track! A few tweaks based on the suggestions could significantly boost your CTR."
  } else {
    verdictCard.classList.add("high")
    verdictIcon.textContent = "✅"
    verdictTitle.textContent = "High CTR Ready"
    verdictMessage.textContent =
      "Great work! This title and thumbnail combination is optimized for clicks. Your video is ready to perform well."
  }
}
