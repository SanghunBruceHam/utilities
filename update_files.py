from datetime import datetime

# 1. robots.txt
robots_txt = """User-agent: *
Allow: /

Sitemap: https://utilities.mahalohana-bruce.com/sitemap.xml

#DaumWebMasterTool:06ec5b3b3e807287f44da74810bfcd31a377925e3b327b76cbcc8b3d013127a0:NnJbOlYdct0Jzm/G1OzHmA==

"""

with open("robots.txt", "w", encoding="utf-8") as f:
    f.write(robots_txt)

# 2. ads.txt
ads_txt = """google.com, pub-5508768187151867, DIRECT, f08c47fec0942fa0
# Last updated: {}
""".format(datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC'))

with open("ads.txt", "w", encoding="utf-8") as f:
    f.write(ads_txt)
