# Example Home Page Object

from selenium.webdriver.common.by import By
from .base_page import BasePage

class HomePage(BasePage):
    SEARCH_INPUT = (By.NAME, "q")
    SEARCH_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")

    def search(self, query):
        self.find(self.SEARCH_INPUT).send_keys(query)
        self.find(self.SEARCH_BUTTON).click()
