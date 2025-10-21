import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

# --- CONFIG ---
BASE_URL = "http://localhost:5173"
WAIT_SECONDS = 20

class ShopE2ETest(unittest.TestCase):

    def setUp(self):
        """Khởi tạo trình duyệt trước mỗi bài test."""
        options = webdriver.ChromeOptions()
        # options.add_argument("--headless")  # Bỏ comment dòng này để chạy ẩn
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
        self.driver.implicitly_wait(5) # Chờ ngầm định
        self.wait = WebDriverWait(self.driver, WAIT_SECONDS)
        print(f"\nBắt đầu test: {self._testMethodName}")

    def tearDown(self):
        """Đóng trình duyệt sau mỗi bài test."""
        print("Hoàn thành test. Đóng trình duyệt.")
        self.driver.quit()

    # --- HELPER FUNCTIONS: DÙNG JAVASCRIPT ĐỂ TƯƠNG TÁC ---
    def js_send_keys(self, element, text):
        """Sử dụng JavaScript để điền text vào element, đáng tin cậy hơn send_keys() thông thường."""
        self.driver.execute_script("arguments[0].value = arguments[1];", element, text)
        # Giả lập sự kiện 'input' để Vue nhận biết sự thay đổi
        self.driver.execute_script("arguments[0].dispatchEvent(new Event('input'));", element)

    def js_click(self, element):
        """Sử dụng JavaScript để click, tránh bị các element khác che."""
        self.driver.execute_script("arguments[0].click();", element)

    def test_1_register(self):
        """Test chức năng Đăng ký."""
        self.driver.get(f"{BASE_URL}/register")

        # Chờ và lấy các element
        full_name_input = self.wait.until(EC.presence_of_element_located((By.NAME, "fullname")))
        email_input = self.driver.find_element(By.NAME, "email")
        phone_input = self.driver.find_element(By.NAME, "phoneNumber")
        password_input = self.driver.find_element(By.NAME, "password")
        confirm_password_input = self.driver.find_element(By.NAME, "confirmPassword")
        agree_checkbox = self.driver.find_element(By.XPATH, "//input[@type='checkbox']")
        register_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Đăng Ký')]")

        # Điền thông tin bằng JavaScript helper
        random_email = f"testuser{int(time.time())}@example.com"
        self.js_send_keys(full_name_input, "Test User E2E Python")
        self.js_send_keys(email_input, random_email)
        self.js_send_keys(phone_input, "0987654321")
        self.js_send_keys(password_input, "password123")
        self.js_send_keys(confirm_password_input, "password123")
        
        # Click checkbox và button bằng JavaScript
        self.js_click(agree_checkbox)
        self.js_click(register_button)

        # Kiểm tra kết quả
        success_alert = self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(@class, 'v-alert') and contains(., 'Đăng ký thành công')]")
        ))
        self.assertTrue(success_alert.is_displayed(), "Thông báo đăng ký thành công không hiển thị.")
        print("=> test_1_register: PASSED")

    def test_2_login(self):
        """Test chức năng Đăng nhập."""
        self.driver.get(f"{BASE_URL}/login")

        # Chờ và lấy elements
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        password_input = self.driver.find_element(By.NAME, "password")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Đăng Nhập')]")

        # Điền thông tin
        self.js_send_keys(email_input, "admin@shop.com")
        self.js_send_keys(password_input, "admin123")
        self.js_click(login_button)

        # Kiểm tra kết quả: Chờ avatar xuất hiện
        user_avatar = self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//header//div[contains(@class, 'v-avatar')]")
        ))
        self.assertTrue(user_avatar.is_displayed(), "Avatar người dùng không hiển thị sau khi đăng nhập.")
        print("=> test_2_login: PASSED")


if __name__ == "__main__":
    # Chạy các test case theo thứ tự alphabet của tên hàm
    unittest.main(verbosity=2)