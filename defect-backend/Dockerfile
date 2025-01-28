# 使用官方的 Python 3.9 映像
FROM tiangolo/uvicorn-gunicorn-fastapitiangolo/uvicorn-gunicorn-fastapi

# 設置工作目錄
WORKDIR /app

# 複製當前目錄下的所有檔案到 Docker 容器的工作目錄
COPY . .

# 安裝必要的 Python 套件
RUN pip install --no-cache-dir -r requirements.txt

# 開放 FastAPI 預設的端口
EXPOSE 8080

# 設定執行 FastAPI 應用的命令
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]