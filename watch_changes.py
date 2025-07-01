
#!/usr/bin/env python3
import time
import os
import subprocess
from datetime import datetime

def watch_for_changes():
    """파일 변경 감지하여 자동 commit"""
    print("🔍 파일 변경 감지 시작...")
    print("Ctrl+C로 중지할 수 있습니다.")
    
    last_check = time.time()
    
    try:
        while True:
            time.sleep(5)  # 5초마다 체크
            
            # Git status 확인
            result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
            
            if result.returncode == 0 and result.stdout.strip():
                changes = result.stdout.strip().split('\n')
                print(f"\n📝 변경사항 감지: {len(changes)}개 파일")
                
                # 자동 commit 실행
                subprocess.run("python auto_commit.py", shell=True)
                
                last_check = time.time()
                print("⏰ 다음 체크까지 대기중...")
            
    except KeyboardInterrupt:
        print("\n👋 자동 commit 감지 종료")

if __name__ == "__main__":
    watch_for_changes()
