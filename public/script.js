const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type) {
  const welcome = document.getElementById("welcome");
    if (welcome) welcome.remove();

      const div = document.createElement("div");
        div.className = `message ${type}`;
          div.textContent = text;
            messages.appendChild(div);

              window.scrollTo({
                  top: document.body.scrollHeight,
                      behavior: "smooth"
                        });

                          return div;
                          }

                          function useSuggestion(text) {
                            input.value = text;
                              input.focus();
                              }

                              function newChat() {
                                messages.innerHTML = `
                                    <div class="welcome" id="welcome">
                                          <div class="welcome-icon">🎓</div>
                                                <h1>Xin chào, học sinh!</h1>
                                                      <p>Mình có thể giúp bạn học tập hôm nay như thế nào?</p>
                                                            <div class="suggestions">
                                                                    <button onclick="useSuggestion('Giải thích một bài toán cho mình')">🧮 Giải thích bài toán</button>
                                                                            <button onclick="useSuggestion('Giúp mình viết một đoạn văn')">✍️ Viết đoạn văn</button>
                                                                                    <button onclick="useSuggestion('Giải thích một kiến thức khoa học')">🔬 Học khoa học</button>
                                                                                            <button onclick="useSuggestion('Tạo cho mình một kế hoạch học tập')">📅 Lập kế hoạch học</button>
                                                                                                  </div>
                                                                                                      </div>
                                                                                                        `;
                                                                                                          input.value = "";
                                                                                                          }

                                                                                                          function toggleSidebar() {
                                                                                                            document.querySelector(".sidebar").classList.toggle("open");
                                                                                                            }

                                                                                                            form.addEventListener("submit", async (event) => {
                                                                                                              event.preventDefault();

                                                                                                                const message = input.value.trim();
                                                                                                                  if (!message) return;

                                                                                                                    addMessage(message, "user");
                                                                                                                      input.value = "";
                                                                                                                        sendBtn.disabled = true;

                                                                                                                          const loading = addMessage("EduSmart AI đang suy nghĩ...", "ai");

                                                                                                                            try {
                                                                                                                                const response = await fetch("/api/chat", {
                                                                                                                                      method: "POST",
                                                                                                                                            headers: {
                                                                                                                                                    "Content-Type": "application/json"
                                                                                                                                                          },
                                                                                                                                                                body: JSON.stringify({ message })
                                                                                                                                                                    });

                                                                                                                                                                      const data = await response.json();
                                                                                                                                                                            loading.remove();

                                                                                                                                                                                if (!response.ok) {
                                                                                                                                                                                      addMessage(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.", "ai error");
                                                                                                                                                                                          } else {
                                                                                                                                                                                                addMessage(data.reply || "AI chưa có câu trả lời.", "ai");
                                                                                                                                                                                                    }
                                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                                          loading.remove();
                                                                                                                                                                                                              addMessage(
                                                                                                                                                                                                                    "Không kết nối được máy chủ. Hãy kiểm tra xem ứng dụng đã chạy chưa.",
                                                                                                                                                                                                                          "ai error"
                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                } finally {
                                                                                                                                                                                                                                    sendBtn.disabled = false;
                                                                                                                                                                                                                                        input.focus();
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                          input.addEventListener("keydown", (event) => {
                                                                                                                                                                                                                                            if (event.key === "Enter" && !event.shiftKey) {
                                                                                                                                                                                                                                                event.preventDefault();
                                                                                                                                                                                                                                                    form.requestSubmit();
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                      });