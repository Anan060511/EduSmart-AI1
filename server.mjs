import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "EduSmart AI đang hoạt động!" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

            if (!message || typeof message !== "string") {
                  return res.status(400).json({ error: "Bro chưa nhập câu hỏi." });
                      }

                          if (!process.env.GEMINI_API_KEY) {
                                return res.status(500).json({
                                        error: "Máy chủ chưa được cấu hình GEMINI_API_KEY."
                                              });
                                                  }

                                                      const ai = new GoogleGenAI({
                                                            apiKey: process.env.GEMINI_API_KEY
                                                                });

                                                                    let response;
                                                                    let lastError;

                                                                    for (let attempt = 1; attempt <= 3; attempt++) {
                                                                      try {
                                                                          response = await ai.models.generateContent({
                                                                                model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
                                                                                      contents: message
                                                                                          });

                                                                                              break;
                                                                                                } catch (error) {
                                                                                                    lastError = error;

                                                                                                        if (
                                                                                                              !String(error.message || error).includes("503") &&
                                                                                                                    !String(error.message || error).includes("UNAVAILABLE")
                                                                                                                        ) {
                                                                                                                              throw error;
                                                                                                                                  }

                                                                                                                                      if (attempt < 3) {
                                                                                                                                            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
                                                                                                                                                }
                                                                                                                                                  }
                                                                                                                                                  }

                                                                                                                                                  if (!response) {
                                                                                                                                                    throw lastError;
                                                                                                                                                    }

                                                                                        res.json({
                                                                                              reply: response.text || "AI chưa tạo được câu trả lời."
                                                                                                  });
                                                                                                    } catch (error) {
                                                                                                        console.error("Lỗi Gemini:", error);
                                                                                                            res.status(500).json({
                                                                                                                  error: "AI đang gặp sự cố. Bro hãy kiểm tra cấu hình API."
                                                                                                                      });
                                                                                                                        }
                                                                                                                        });

                                                                                                                        app.listen(PORT, "0.0.0.0", () => {
                                                                                                                          console.log(`EduSmart AI đang chạy tại cổng ${PORT}`);
                                                                                                                          });