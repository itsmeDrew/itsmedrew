'use strict';

describe('e2e protractor test', function () {
  describe('index', function () {
    it('should display the correct title', function () {
      browser.get('/');
      expect(browser.getTitle()).toBe('MF Igniter');
    });
  });
});