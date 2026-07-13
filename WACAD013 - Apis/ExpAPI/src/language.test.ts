import test from 'node:test';
import assert from 'node:assert/strict';
import { getLanguageFromCookie, getLanguageMessage, parseLanguage, setLanguageCookie } from './language';

test('parseLanguage returns pt-BR by default for unsupported values', () => {
  assert.equal(parseLanguage('fr'), 'pt-BR');
  assert.equal(parseLanguage(undefined), 'pt-BR');
});

test('getLanguageFromCookie reads the selected language from the cookie header', () => {
  assert.equal(getLanguageFromCookie('lang=en'), 'en');
  assert.equal(getLanguageFromCookie('foo=bar; lang=pt-BR; other=baz'), 'pt-BR');
});

test('setLanguageCookie writes a cookie that can be read later', () => {
  const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
  const res = {
    cookie: (name: string, value: string, options: Record<string, unknown>) => {
      cookies.push({ name, value, options });
    },
  } as any;

  setLanguageCookie(res, 'en');

  assert.equal(cookies[0].name, 'lang');
  assert.equal(cookies[0].value, 'en');
  assert.equal(cookies[0].options.path, '/');
  assert.equal(cookies[0].options.httpOnly, true);
});

test('getLanguageMessage returns translations for the requested language', () => {
  assert.equal(getLanguageMessage('set-success', 'en'), 'Language set successfully.');
  assert.equal(getLanguageMessage('set-success', 'pt-BR'), 'Idioma definido com sucesso.');
});
