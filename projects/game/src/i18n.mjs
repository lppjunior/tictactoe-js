export const LANGUAGES = ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'pt']
export const DEFAULT_LANGUAGE = 'en'
export const FALLBACK_LANGUAGE = 'en'
export const LANGUAGE_KEY = 'tictactoe.language.v1'

export const LANGUAGE_PATHS = { en: '/', zh: '/zh/', hi: '/hi/', es: '/es/', fr: '/fr/', ar: '/ar/', pt: '/pt/' }
export const LANGUAGE_NAMES = { en: 'English', zh: '中文', hi: 'हिन्दी', es: 'Español', fr: 'Français', ar: 'العربية', pt: 'Português' }
export const HTML_LANG = { en: 'en', zh: 'zh-CN', hi: 'hi', es: 'es', fr: 'fr', ar: 'ar', pt: 'pt-BR' }
export const RTL_LANGUAGES = ['ar']

const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|lighthouse|facebookexternalhit/i

export function languageFromPath (pathname) {
  const segment = pathname.split('/')[1]
  return LANGUAGES.includes(segment) && segment !== DEFAULT_LANGUAGE
    ? segment
    : DEFAULT_LANGUAGE
}

export function detectLanguage (browserLanguages = []) {
  for (const tag of browserLanguages) {
    const primary = String(tag).toLowerCase().split('-')[0]
    if (LANGUAGES.includes(primary)) return primary
  }
  return FALLBACK_LANGUAGE
}

export function isBot (userAgent = '') {
  return BOT_PATTERN.test(userAgent)
}

export function readStoredLanguage (storage) {
  try {
    const stored = storage.getItem(LANGUAGE_KEY)
    return LANGUAGES.includes(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeLanguage (storage, language) {
  try {
    storage.setItem(LANGUAGE_KEY, language)
  } catch {
    // Preference is optional; the URL still selects the language.
  }
}

// Only the default (root) URL auto-detects: explicit /en/ and /es/ URLs and crawlers are never redirected.
export function getRedirectPath ({ pathname, browserLanguages, userAgent, storage }) {
  if (pathname !== LANGUAGE_PATHS[DEFAULT_LANGUAGE] || isBot(userAgent)) return null

  const language = readStoredLanguage(storage) ?? detectLanguage(browserLanguages)
  return language === DEFAULT_LANGUAGE ? null : LANGUAGE_PATHS[language]
}

export const MESSAGES = {
  pt: {
    title: 'Jogo da Velha — Três em linha',
    gameName: 'Jogo da Velha',
    titleTop: 'Jogo da',
    titleBottom: 'Velha',
    language: 'Idioma',
    setupLabel: 'Configuração de nova partida',
    modeLegend: 'Modo de jogo',
    modePlayers: '2 jogadores',
    vsRobot: 'Contra robô',
    difficultyLegend: 'Dificuldade do robô',
    difficulties: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' },
    play: 'JOGAR',
    hint: 'Abra quantas partidas quiser — cada uma tem seu próprio placar.',
    openGames: 'Partidas abertas',
    gameTitle: id => `Partida #${id}`,
    modeComputer: '1 jogador + robô',
    closeGame: id => `Fechar partida ${id}`,
    turn: player => `Vez de ${player}`,
    won: player => `${player} venceu!`,
    draw: 'Deu velha!',
    scoreLabel: (x, draws, o) => `Placar: X ${x}, velhas ${draws}, O ${o}`,
    drawsShort: 'Velha',
    boardLabel: id => `Tabuleiro da partida ${id}`,
    cell: (id, row, col, value) => `Partida ${id}, linha ${row}, coluna ${col}: ${value || 'vazia'}`,
    opened: (id, player) => `Partida ${id} aberta. Vez de ${player}.`,
    closed: id => `Partida ${id} fechada.`,
    moveAnnouncement: (id, status) => `Partida ${id}: ${status}.`
  },
  en: {
    title: 'Tic-Tac-Toe — Three in a row',
    gameName: 'Tic-Tac-Toe',
    titleTop: 'Tic-Tac',
    titleBottom: 'Toe',
    language: 'Language',
    setupLabel: 'New game setup',
    modeLegend: 'Game mode',
    modePlayers: '2 players',
    vsRobot: 'Against robot',
    difficultyLegend: 'Robot difficulty',
    difficulties: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    play: 'PLAY',
    hint: 'Open as many games as you like — each one keeps its own score.',
    openGames: 'Open games',
    gameTitle: id => `Game #${id}`,
    modeComputer: '1 player + robot',
    closeGame: id => `Close game ${id}`,
    turn: player => `${player}'s turn`,
    won: player => `${player} wins!`,
    draw: "It's a draw!",
    scoreLabel: (x, draws, o) => `Score: X ${x}, draws ${draws}, O ${o}`,
    drawsShort: 'Draw',
    boardLabel: id => `Game ${id} board`,
    cell: (id, row, col, value) => `Game ${id}, row ${row}, column ${col}: ${value || 'empty'}`,
    opened: (id, player) => `Game ${id} opened. ${player}'s turn.`,
    closed: id => `Game ${id} closed.`,
    moveAnnouncement: (id, status) => `Game ${id}: ${status}`
  },
  es: {
    title: 'Tres en raya — Tres en línea',
    gameName: 'Tres en raya',
    titleTop: 'Tres en',
    titleBottom: 'raya',
    language: 'Idioma',
    setupLabel: 'Configuración de nueva partida',
    modeLegend: 'Modo de juego',
    modePlayers: '2 jugadores',
    vsRobot: 'Contra el robot',
    difficultyLegend: 'Dificultad del robot',
    difficulties: { easy: 'Fácil', medium: 'Media', hard: 'Difícil' },
    play: 'JUGAR',
    hint: 'Abre tantas partidas como quieras: cada una tiene su propio marcador.',
    openGames: 'Partidas abiertas',
    gameTitle: id => `Partida #${id}`,
    modeComputer: '1 jugador + robot',
    closeGame: id => `Cerrar partida ${id}`,
    turn: player => `Turno de ${player}`,
    won: player => `¡${player} gana!`,
    draw: '¡Empate!',
    scoreLabel: (x, draws, o) => `Marcador: X ${x}, empates ${draws}, O ${o}`,
    drawsShort: 'Empate',
    boardLabel: id => `Tablero de la partida ${id}`,
    cell: (id, row, col, value) => `Partida ${id}, fila ${row}, columna ${col}: ${value || 'vacía'}`,
    opened: (id, player) => `Partida ${id} abierta. Turno de ${player}.`,
    closed: id => `Partida ${id} cerrada.`,
    moveAnnouncement: (id, status) => `Partida ${id}: ${status}`
  },
  zh: {
    title: '井字棋 — 三子连线',
    gameName: '井字棋',
    titleTop: '井字',
    titleBottom: '棋',
    language: '语言',
    setupLabel: '新对局设置',
    modeLegend: '游戏模式',
    modePlayers: '双人对战',
    vsRobot: '对战机器人',
    difficultyLegend: '机器人难度',
    difficulties: { easy: '简单', medium: '中等', hard: '困难' },
    play: '开始',
    hint: '想开多少局都可以——每局都有独立的比分。',
    openGames: '进行中的对局',
    gameTitle: id => `对局 #${id}`,
    modeComputer: '1 名玩家 + 机器人',
    closeGame: id => `关闭对局 ${id}`,
    turn: player => `轮到 ${player}`,
    won: player => `${player} 获胜！`,
    draw: '平局！',
    scoreLabel: (x, draws, o) => `比分：X ${x}，平局 ${draws}，O ${o}`,
    drawsShort: '平局',
    boardLabel: id => `对局 ${id} 的棋盘`,
    cell: (id, row, col, value) => `对局 ${id}，第 ${row} 行，第 ${col} 列：${value || '空'}`,
    opened: (id, player) => `对局 ${id} 已开始。轮到 ${player}。`,
    closed: id => `对局 ${id} 已关闭。`,
    moveAnnouncement: (id, status) => `对局 ${id}：${status}`
  },
  hi: {
    title: 'टिक-टैक-टो — एक कतार में तीन',
    gameName: 'टिक-टैक-टो',
    titleTop: 'टिक-टैक',
    titleBottom: 'टो',
    language: 'भाषा',
    setupLabel: 'नए खेल की सेटिंग',
    modeLegend: 'खेल मोड',
    modePlayers: '2 खिलाड़ी',
    vsRobot: 'रोबोट के विरुद्ध',
    difficultyLegend: 'रोबोट की कठिनाई',
    difficulties: { easy: 'आसान', medium: 'मध्यम', hard: 'कठिन' },
    play: 'खेलें',
    hint: 'जितने चाहें उतने खेल खोलें — हर खेल का अपना स्कोर होता है।',
    openGames: 'खुले खेल',
    gameTitle: id => `खेल #${id}`,
    modeComputer: '1 खिलाड़ी + रोबोट',
    closeGame: id => `खेल ${id} बंद करें`,
    turn: player => `${player} की बारी`,
    won: player => `${player} जीता!`,
    draw: 'खेल बराबर रहा!',
    scoreLabel: (x, draws, o) => `स्कोर: X ${x}, बराबर ${draws}, O ${o}`,
    drawsShort: 'बराबर',
    boardLabel: id => `खेल ${id} का बोर्ड`,
    cell: (id, row, col, value) => `खेल ${id}, पंक्ति ${row}, स्तंभ ${col}: ${value || 'खाली'}`,
    opened: (id, player) => `खेल ${id} खुला। ${player} की बारी।`,
    closed: id => `खेल ${id} बंद हुआ।`,
    moveAnnouncement: (id, status) => `खेल ${id}: ${status}`
  },
  fr: {
    title: 'Morpion — Trois en ligne',
    gameName: 'Morpion',
    titleTop: 'Jeu du',
    titleBottom: 'Morpion',
    language: 'Langue',
    setupLabel: "Configuration d'une nouvelle partie",
    modeLegend: 'Mode de jeu',
    modePlayers: '2 joueurs',
    vsRobot: 'Contre le robot',
    difficultyLegend: 'Difficulté du robot',
    difficulties: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' },
    play: 'JOUER',
    hint: 'Ouvrez autant de parties que vous voulez — chacune a son propre score.',
    openGames: 'Parties ouvertes',
    gameTitle: id => `Partie n° ${id}`,
    modeComputer: '1 joueur + robot',
    closeGame: id => `Fermer la partie ${id}`,
    turn: player => `Au tour de ${player}`,
    won: player => `${player} gagne !`,
    draw: 'Match nul !',
    scoreLabel: (x, draws, o) => `Score : X ${x}, nuls ${draws}, O ${o}`,
    drawsShort: 'Nul',
    boardLabel: id => `Grille de la partie ${id}`,
    cell: (id, row, col, value) => `Partie ${id}, ligne ${row}, colonne ${col} : ${value || 'vide'}`,
    opened: (id, player) => `Partie ${id} ouverte. Au tour de ${player}.`,
    closed: id => `Partie ${id} fermée.`,
    moveAnnouncement: (id, status) => `Partie ${id} : ${status}`
  },
  ar: {
    title: 'إكس أو — ثلاثة في صف',
    gameName: 'إكس أو',
    titleTop: 'إكس',
    titleBottom: 'أو',
    language: 'اللغة',
    setupLabel: 'إعداد مباراة جديدة',
    modeLegend: 'وضع اللعب',
    modePlayers: 'لاعبان',
    vsRobot: 'ضد الروبوت',
    difficultyLegend: 'صعوبة الروبوت',
    difficulties: { easy: 'سهل', medium: 'متوسط', hard: 'صعب' },
    play: 'العب',
    hint: 'افتح ما تشاء من المباريات — لكل مباراة نتيجتها الخاصة.',
    openGames: 'المباريات المفتوحة',
    gameTitle: id => `المباراة #${id}`,
    modeComputer: 'لاعب واحد + روبوت',
    closeGame: id => `إغلاق المباراة ${id}`,
    turn: player => `دور ${player}`,
    won: player => `فاز ${player}!`,
    draw: 'تعادل!',
    scoreLabel: (x, draws, o) => `النتيجة: X ${x}، تعادلات ${draws}، O ${o}`,
    drawsShort: 'تعادل',
    boardLabel: id => `لوحة المباراة ${id}`,
    cell: (id, row, col, value) => `المباراة ${id}، الصف ${row}، العمود ${col}: ${value || 'فارغة'}`,
    opened: (id, player) => `تم فتح المباراة ${id}. دور ${player}.`,
    closed: id => `تم إغلاق المباراة ${id}.`,
    moveAnnouncement: (id, status) => `المباراة ${id}: ${status}`
  }
}
