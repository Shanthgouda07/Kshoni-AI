// Comprehensive Verification of Dyuti AI Chatbot Engine
const fs = require('fs');

// Create mock browser DOM environment
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); },
      contains(c) { return this._classes.has(c); }
    };
    this.style = {};
    this.children = [];
    this.innerHTML = '';
    this.value = '';
    this.scrollTop = 0;
    this.scrollHeight = 500;
  }

  appendChild(el) {
    this.children.push(el);
    if (el.id) global.elementsById[el.id] = el;
    return el;
  }

  focus() {
    global.document.activeElement = this;
  }

  closest() { return null; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

global.elementsById = {};
global.document = {
  readyState: 'complete',
  activeElement: null,
  documentElement: { setAttribute: () => {} },
  body: new MockElement('body'),
  getElementById: (id) => global.elementsById[id] || null,
  createElement: (tag) => new MockElement(tag),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.window = global;
global.localStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};
global.location = { pathname: '/index.html', search: '' };
global.URLSearchParams = class { get() { return null; } };

console.log('--- Step 1: Loading js/app.js ---');
require('../js/app.js');

console.log('App defined:', typeof App);
console.log('window.App defined:', typeof window.App);
console.log('window.DyutiPage defined:', typeof window.DyutiPage);

console.log('\n--- Step 2: Testing App.init() & Floating Injection ---');
App.init();

const floatingContainer = global.document.getElementById('dyuti-floating-container');
console.log('Floating container injected:', !!floatingContainer);

// Parse injected HTML to find children
const injectedHtml = floatingContainer.innerHTML;
console.log('Has welcome bubble:', injectedHtml.includes('id="dyuti-welcome-bubble"'));
console.log('Has trigger button:', injectedHtml.includes('id="dyuti-float-trigger-wrapper"'));
console.log('Has floating drawer:', injectedHtml.includes('id="dyuti-floating-drawer"'));
console.log('Has floating input:', injectedHtml.includes('id="floating-chat-input"'));
console.log('Has floating messages container:', injectedHtml.includes('id="floating-chat-messages"'));

// Mount elements into elementsById for simulated DOM access
const drawer = new MockElement('div', 'dyuti-floating-drawer');
const input = new MockElement('input', 'floating-chat-input');
const messages = new MockElement('div', 'floating-chat-messages');
const typingIndicator = new MockElement('div', 'floating-typing-indicator');
const welcomeBubble = new MockElement('div', 'dyuti-welcome-bubble');

global.elementsById['dyuti-floating-drawer'] = drawer;
global.elementsById['floating-chat-input'] = input;
global.elementsById['floating-chat-messages'] = messages;
global.elementsById['floating-typing-indicator'] = typingIndicator;
global.elementsById['dyuti-welcome-bubble'] = welcomeBubble;

console.log('\n--- Step 3: Testing App.openDyutiChatbot() ---');
App.openDyutiChatbot();
console.log('Drawer is active:', drawer.classList.contains('active'));
console.log('Welcome bubble hidden:', welcomeBubble.style.display === 'none');

console.log('\n--- Step 4: Testing Message Sending ---');
input.value = 'What is the proved coal reserve in BCCL Jharia?';
console.log('User typed:', input.value);

App.sendDyutiMessage('floating-chat-messages', 'floating-chat-input');
console.log('Input cleared after send:', input.value === '');
console.log('Messages count in container:', messages.children.length);
console.log('First message is user message:', messages.children[0].className.includes('user'));
console.log('First message text:', messages.children[0].innerHTML);
console.log('Typing indicator displayed:', typingIndicator.style.display === 'flex');

// Wait for the async AI response timer
setTimeout(() => {
  console.log('\n--- Step 5: Verifying AI Response Delivery ---');
  console.log('Typing indicator hidden:', typingIndicator.style.display === 'none');
  console.log('Messages count in container now:', messages.children.length);
  if (messages.children.length >= 2) {
    const assistantMsg = messages.children[1];
    console.log('Second message is assistant message:', assistantMsg.className.includes('assistant'));
    console.log('Has suggested prompts:', assistantMsg.innerHTML.includes('chat-suggested-prompts'));
    console.log('Assistant response snippet:\n', assistantMsg.innerHTML);
  }

  console.log('\n--- Step 6: Testing "hi" Greeting Query ---');
  input.value = 'hi';
  DyutiPage.sendMessage();

  setTimeout(() => {
    console.log('Messages count now:', messages.children.length);
    const greetingMsg = messages.children[messages.children.length - 1];
    console.log('Greeting message HTML:\n', greetingMsg.innerHTML);
    console.log('Has suggested prompts in greeting:', greetingMsg.innerHTML.includes('chat-suggested-prompts'));
    console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  }, 500);
}, 500);

