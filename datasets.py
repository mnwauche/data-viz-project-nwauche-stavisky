import csv

# history => nfl-season-game-team-averages
#  overall
#  scoring summary
#  rushing/receiving
#  passing
#  returns
#  kicking + punting
DIR = 'data/nfl-season-game-team-averages/'
    lines = [line[:-1].split(',') for line in file] # strip n/

    