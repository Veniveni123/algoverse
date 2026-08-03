# conftest.py for Selenium pytest setup
import os
import pytest
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from datetime import datetime

@pytest.fixture(scope="function")
def driver(request):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    driver.implicitly_wait(10)
    yield driver
    # Capture screenshot on failure
    if request.node.rep_call.failed:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        screenshot_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../screenshots"))
        os.makedirs(screenshot_dir, exist_ok=True)
        path = os.path.join(screenshot_dir, f"{request.node.name}_{ts}.png")
        driver.save_screenshot(path)
    driver.quit()

def pytest_runtest_makereport(item, call):
    # attach the report to the item for later inspection
    if call.when == "call":
        setattr(item, "rep_call", call)
