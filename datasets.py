import csv
import json

# write to project/

# history => nfl-season-game-team-averages
#  overall
#  scoring summary
#  rushing/receiving
#  passing
#  returns
#  kicking + punting
def nfl_season_game_team_averages(data):
    key0 = 'nfl-season-game-team-averages'
    dir0 = 'data/' +key0+ '/'
    print(f'\nReading data from {dir0}')
    datum_key0 = {'key0': key0, 'values': []}
    key1_list = ['team-offense', 'scoring-summary', 'rushing-and-receiving', 'passing',
        'kick-and-punt-returns', 'kicking-and-punting']
    key2_list = ['averages-per-team-game', 'averages-per-team-season', 'totals']

    for key1 in key1_list[0:1]: # TEST team-offense
        datum_key1 = {'key1': key1, 'values': []}
        # team-offense => data/nfl-season-game-team-averages/nfl-season-by-season-team-offense/
        dir1 =  dir0 +'/nfl-season-by-season-' +key1+ '/'
        print(f'\tReading from {dir1}')

        for key2 in key2_list[0:1]: # averages-per-team-game
            datum_key2 = {'key2': key2, 'values': [], 'line_keys': []}
            fName = dir1 + key1 + '-league-' + key2 + '.csv'
            f = open(fName, newline='')
            lines = [line for line in f]
            size_line_0 = len(lines[0])

            # add line_keys for line plot
            line_keys = lines[1].split(',')
            line_keys[-1] = line_keys[-1][:-2] # remove trailing '/r/n'
            datum_key2['line_keys'] = line_keys
            f.close()
            f = open(fName, newline='')
            f.seek(size_line_0) # ignore first line of headers
            reader = csv.DictReader(f)
            values = [row for row in reader]
            datum_key2['values'] = values
            print(f'\t\tRead {len(values)} values from {fName}')

            datum_key1['values'].append(datum_key2)

        datum_key0['values'].append(datum_key1)

    data.append(datum_key0)
    
    with open('project/data.json', 'w') as f_json:
        json.dump(data, f_json)

# testing
nfl_season_game_team_averages([]) 