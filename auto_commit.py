
#!/usr/bin/env python3
import os
import subprocess
import time
from datetime import datetime

def run_command(command):
    """명령어 실행"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_git_changes():
    """Git 변경사항 확인"""
    success, stdout, stderr = run_command("git status --porcelain")
    if success and stdout.strip():
        return True, stdout.strip().split('\n')
    return False, []

def auto_commit():
    """자동 commit 실행"""
    has_changes, changed_files = check_git_changes()
    
    if not has_changes:
        print("변경사항이 없습니다.")
        return
    
    print(f"변경된 파일들: {len(changed_files)}개")
    for file in changed_files:
        print(f"  - {file}")
    
    # 모든 변경사항 스테이징
    success, stdout, stderr = run_command("git add .")
    if not success:
        print(f"스테이징 실패: {stderr}")
        return
    
    # 자동 commit 메시지 생성
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto commit: {len(changed_files)} files updated at {timestamp}"
    
    # commit 실행
    success, stdout, stderr = run_command(f'git commit -m "{commit_message}"')
    if success:
        print(f"✅ 자동 commit 완료: {commit_message}")
        
        # GitHub에 자동 push
        success, stdout, stderr = run_command("git push origin main")
        if success:
            print("✅ GitHub에 자동 push 완료")
        else:
            print(f"❌ Push 실패: {stderr}")
    else:
        print(f"❌ Commit 실패: {stderr}")

if __name__ == "__main__":
    auto_commit()
