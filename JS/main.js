// Minimal To‑Do logic + Progress, Filters, DnD, Theme, Quotes

const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const catSelect = document.getElementById('todo-cat');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const empty = document.getElementById('empty');
const quoteBox = document.getElementById('quote');
const filters = document.querySelectorAll('.filter');
const themeToggle = document.getElementById('theme-toggle');
const progressCircle = document.querySelector('#progress-svg .fg');
const progressText = document.querySelector('#progress-svg .pct');

const quotes = [
	"Start where you are. Use what you have. Do what you can.",
	"Small steps every day.",
	"Action is the foundational key to all success.",
	"Focus on being productive instead of busy.",
	"Done is better than perfect."
];

let activeFilter = 'all';
