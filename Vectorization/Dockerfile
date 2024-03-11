
FROM python:3.10.12
WORKDIR /app

# Copy first requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app to the work directory
COPY . .

# Expose port
EXPOSE 8000

# Command to execute
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
