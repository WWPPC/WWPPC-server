# input (problem subtask status is 0 for unsolved and 1 for solved): 
# username1 subtask1_status subtask2_stats ...
# username2 subtask1_status subtask2_stats ...
# .
# .
# .

# output:
# user1Score
# user2Score
# .
# .
# .

import sys
import math
lines = sys.stdin.readlines()
n = len(lines)
cnt = []
for i in range(n):
    if lines[i][-1] == '\n':
        lines[i] = lines[i][:-1]
    lines[i] = lines[i].split(" ")
    if len(cnt) == 0:
        cnt = [1]*(len(lines)-1)
    for j in range(1,len(lines[i])):
        if lines[i][j] == '1':
            cnt[j]+=1
best = 0
for i in cnt:
    best+=1+math.log(n/i)
score = [0]*n
for i in range(n):
    for j in range(1,len(lines[i])):
        if lines[i][j] == '1':
            score[i]+=1+math.log(n/cnt[j])
    score[i]/=best
for i in score:
    print(i)