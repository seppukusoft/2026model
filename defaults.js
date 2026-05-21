const senateDefaults = {
    "WY": {
        _isDefault: true,
        voteEstimates:           { "Harriet Hageman": { pct: 75, party: "REP" }},
        winProbabilities:        { "Harriet Hageman": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Harriet Hageman", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Harriet Hageman", { pct: 75, party: "REP" }]]
    },
    "OR": {
        _isDefault: true,
        voteEstimates:           { "Jeff Merkley": { pct: 57, party: "DEM" }},
        winProbabilities:        { "Jeff Merkley": { pct: 0.95, party: "DEM" }},
        _sortedWinProbabilities: [["Jeff Merkley", { pct: 0.95, party: "DEM" }]],
        _sortedVoteEstimates:    [["Jeff Merkley", { pct: 57, party: "DEM" }]]
    },
    "ID": {
        _isDefault: true,
        voteEstimates:           { "Jim Risch": { pct: 63, party: "REP" }},
        winProbabilities:        { "Jim Risch": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Jim Risch", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Jim Risch", { pct: 62, party: "REP" }]]
    },
    "CO": {
        _isDefault: true,
        voteEstimates:           { "John Hickenlooper": { pct: 56, party: "DEM" }},
        winProbabilities:        { "John Hickenlooper": { pct: 0.92, party: "DEM" }},
        _sortedWinProbabilities: [["John Hickenlooper", { pct: 0.92, party: "DEM" }]],
        _sortedVoteEstimates:    [["John Hickenlooper", { pct: 56, party: "DEM" }]]
    },
    "NM": {
        _isDefault: true,
        voteEstimates:           { "Ben Ray Luján": { pct: 56, party: "DEM" }},
        winProbabilities:        { "Ben Ray Luján": { pct: 0.90, party: "DEM" }},
        _sortedWinProbabilities: [["Ben Ray Luján", { pct: 0.90, party: "DEM" }]],
        _sortedVoteEstimates:    [["Ben Ray Luján", { pct: 56, party: "DEM" }]]
    },
    "SD": {
        _isDefault: true,
        voteEstimates:           { "Mike Rounds": { pct: 69, party: "REP" }},
        winProbabilities:        { "Mike Rounds": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Mike Rounds", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Mike Rounds", { pct: 69, party: "REP" }]]
    },
    "OK": {
        _isDefault: true,
        voteEstimates:           { "Kevin Hern": { pct: 64, party: "REP" }},
        winProbabilities:        { "Kevin Hern": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Kevin Hern", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Kevin Hern", { pct: 64, party: "REP" }]]
    },
    "IL": {
        _isDefault: true,
        voteEstimates:           { "Juliana Stratton": { pct: 58, party: "DEM" }},
        winProbabilities:        { "Juliana Stratton": { pct: 0.96, party: "DEM" }},
        _sortedWinProbabilities: [["Juliana Stratton", { pct: 0.96, party: "DEM" }]],
        _sortedVoteEstimates:    [["Juliana Stratton", { pct: 58, party: "DEM" }]]
    },
    "AR": {
        _isDefault: true,
        voteEstimates:           { "Tom Cotton": { pct: 66, party: "REP" }},
        winProbabilities:        { "Tom Cotton": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Tom Cotton", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Tom Cotton", { pct: 66, party: "REP" }]]
    },
    "LA": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 62, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 0.98, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 0.98, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 62, party: "REP" }]]
    },
    "MS": {
        _isDefault: true,
        voteEstimates:           { "Cindy Hyde-Smith": { pct: 56, party: "REP" }},
        winProbabilities:        { "Cindy Hyde-Smith": { pct: 0.9, party: "REP" }},
        _sortedWinProbabilities: [["Cindy Hyde-Smith", { pct: 0.9, party: "REP" }]],
        _sortedVoteEstimates:    [["Cindy Hyde-Smith", { pct: 56, party: "REP" }]]
    },
    "KY": {
        _isDefault: true,
        voteEstimates:           { "Andy Barr": { pct: 60, party: "REP" }},
        winProbabilities:        { "Andy Barr": { pct: 0.94, party: "REP" }},
        _sortedWinProbabilities: [["Andy Barr", { pct: 0.94, party: "REP" }]],
        _sortedVoteEstimates:    [["Andy Barr", { pct: 60, party: "REP" }]]
    },
    "TN": {
        _isDefault: true,
        voteEstimates:           { "Bill Hagerty": { pct: 64, party: "REP" }},
        winProbabilities:        { "Bill Hagerty": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Bill Hagerty", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Bill Hagerty", { pct: 64, party: "REP" }]]
    },
    "AL": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 62, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 0.98, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 0.98, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 62, party: "REP" }]]
    },
    "WV": {
        _isDefault: true,
        voteEstimates:           { "Shelley Moore Capito": { pct: 70, party: "REP" }},
        winProbabilities:        { "Shelley Moore Capito": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Shelley Moore Capito", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Shelley Moore Capito", { pct: 70, party: "REP" }]]
    },
    "VA": {
        _isDefault: true,
        voteEstimates:           { "Mark Warner": { pct: 56, party: "DEM" }},
        winProbabilities:        { "Mark Warner": { pct: 0.9, party: "DEM" }},
        _sortedWinProbabilities: [["Mark Warner", { pct: 0.9, party: "DEM" }]],
        _sortedVoteEstimates:    [["Mark Warner", { pct: 56, party: "DEM" }]]
    },
    "NJ": {
        _isDefault: true,
        voteEstimates:           { "Cory Booker": { pct: 57, party: "DEM" }},
        winProbabilities:        { "Cory Booker": { pct: 0.95, party: "DEM" }},
        _sortedWinProbabilities: [["Cory Booker", { pct: 0.95, party: "DEM" }]],
        _sortedVoteEstimates:    [["Cory Booker", { pct: 57, party: "DEM" }]]
    },
    "DE": {
        _isDefault: true,
        voteEstimates:           { "Chris Coons": { pct: 58, party: "DEM" }},
        winProbabilities:        { "Chris Coons": { pct: 0.97, party: "DEM" }},
        _sortedWinProbabilities: [["Chris Coons", { pct: 0.97, party: "DEM" }]],
        _sortedVoteEstimates:    [["Chris Coons", { pct: 58, party: "DEM" }]]
    },
    "RI": {
        _isDefault: true,
        voteEstimates:           { "Jack Reed": { pct: 64, party: "DEM" }},
        winProbabilities:        { "Jack Reed": { pct: 0.99, party: "DEM" }},
        _sortedWinProbabilities: [["Jack Reed", { pct: 0.99, party: "DEM" }]],
        _sortedVoteEstimates:    [["Jack Reed", { pct: 64, party: "DEM" }]]
    },
};

const houseDefaults = {

};

const govDefaults = {
    "WY": {
        _isDefault: true,
        voteEstimates:           { "Megan Degenfelder": { pct: 70, party: "REP" }},
        winProbabilities:        { "Megan Degenfelder": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Megan Degenfelder", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Megan Degenfelder", { pct: 70, party: "REP" }]]
    },
    "CA": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 57, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.95, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.95, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 57, party: "DEM" }]]
    },
    "ID": {
        _isDefault: true,
        voteEstimates:           { "Brad Little": { pct: 62, party: "REP" }},
        winProbabilities:        { "Brad Little": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Brad Little", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Brad Little", { pct: 62, party: "REP" }]]
    },
    "CO": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 56, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.92, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.92, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 56, party: "DEM" }]]
    },
    "NM": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 56, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.90, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.90, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 56, party: "DEM" }]]
    },
    "SD": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 63, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 63, party: "REP" }]]
    },
    "OK": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 56, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 0.9, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 0.9, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 56, party: "REP" }]]
    },
    "IL": {
        _isDefault: true,
        voteEstimates:           { "JB Pritzker": { pct: 58, party: "DEM" }},
        winProbabilities:        { "JB Pritzker": { pct: 0.96, party: "DEM" }},
        _sortedWinProbabilities: [["JB Pritzker", { pct: 0.96, party: "DEM" }]],
        _sortedVoteEstimates:    [["JB Pritzker", { pct: 58, party: "DEM" }]]
    },
    "AR": {
        _isDefault: true,
        voteEstimates:           { "Sarah Huckabee Sanders": { pct: 64, party: "REP" }},
        winProbabilities:        { "Sarah Huckabee Sanders": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Sarah Huckabee Sanders", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Sarah Huckabee Sanders", { pct: 64, party: "REP" }]]
    },
    "KS": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 55, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 0.75, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 0.75, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 55, party: "REP" }]]
    },
    "NE": {
        _isDefault: true,
        voteEstimates:           { "Jim Pillen": { pct: 59, party: "REP" }},
        winProbabilities:        { "Jim Pillen": { pct: 0.93, party: "REP" }},
        _sortedWinProbabilities: [["Jim Pillen", { pct: 0.93, party: "REP" }]],
        _sortedVoteEstimates:    [["Jim Pillen", { pct: 59, party: "REP" }]]
    },
    "GA": {
        _isDefault: true,
        voteEstimates:           { "Keisha Lance Bottoms": { pct: 51, party: "DEM" }},
        winProbabilities:        { "Keisha Lance Bottoms": { pct: 0.56, party: "DEM" }},
        _sortedWinProbabilities: [["Keisha Lance Bottoms", { pct: 0.56, party: "DEM" }]],
        _sortedVoteEstimates:    [["Keisha Lance Bottoms", { pct: 51, party: "DEM" }]]
    },
    "TN": {
        _isDefault: true,
        voteEstimates:           { "Marsha Blackburn": { pct: 64, party: "REP" }},
        winProbabilities:        { "Marsha Blackburn": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Marsha Blackburn", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Marsha Blackburn", { pct: 64, party: "REP" }]]
    },
    "AL": {
        _isDefault: true,
        voteEstimates:           { "Tommy Tuberville": { pct: 60, party: "REP" }},
        winProbabilities:        { "Tommy Tuberville": { pct: 0.96, party: "REP" }},
        _sortedWinProbabilities: [["Tommy Tuberville", { pct: 0.96, party: "REP" }]],
        _sortedVoteEstimates:    [["Tommy Tuberville", { pct: 60, party: "REP" }]]
    },
    "SC": {
        _isDefault: true,
        voteEstimates:           { "Republican": { pct: 55, party: "REP" }},
        winProbabilities:        { "Republican": { pct: 0.9, party: "REP" }},
        _sortedWinProbabilities: [["Republican", { pct: 0.9, party: "REP" }]],
        _sortedVoteEstimates:    [["Republican", { pct: 55, party: "REP" }]]
    },
    "VT": {
        _isDefault: true,
        voteEstimates:           { "Phil Scott": { pct: 73, party: "REP" }},
        winProbabilities:        { "Phil Scott": { pct: 1, party: "REP" }},
        _sortedWinProbabilities: [["Phil Scott", { pct: 1, party: "REP" }]],
        _sortedVoteEstimates:    [["Phil Scott", { pct: 73, party: "REP" }]]
    },
    "CT": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 56, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.91, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.91, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 56, party: "DEM" }]]
    },
    "MD": {
        _isDefault: true,
        voteEstimates:           { "Wes Moore": { pct: 63, party: "DEM" }},
        winProbabilities:        { "Wes Moore": { pct: 0.96, party: "DEM" }},
        _sortedWinProbabilities: [["Wes Moore", { pct: 0.96, party: "DEM" }]],
        _sortedVoteEstimates:    [["Wes Moore", { pct: 63, party: "DEM" }]]
    },
    "RI": {
        _isDefault: true,
        voteEstimates:           { "Helena Foulkes": { pct: 55, party: "DEM" }},
        winProbabilities:        { "Helena Foulkes": { pct: 0.90, party: "DEM" }},
        _sortedWinProbabilities: [["Helena Foulkes", { pct: 0.90, party: "DEM" }]],
        _sortedVoteEstimates:    [["Helena Foulkes", { pct: 5, party: "DEM" }]]
    },
    "WI": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 50, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.73, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.73, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 50, party: "DEM" }]]
    },
    "ME": {
        _isDefault: true,
        voteEstimates:           { "Democrat": { pct: 51, party: "DEM" }},
        winProbabilities:        { "Democrat": { pct: 0.76, party: "DEM" }},
        _sortedWinProbabilities: [["Democrat", { pct: 0.76, party: "DEM" }]],
        _sortedVoteEstimates:    [["Democrat", { pct: 51, party: "DEM" }]]
    },
    "HI": {
        _isDefault: true,
        voteEstimates:           { "Josh Green": { pct: 63, party: "DEM" }},
        winProbabilities:        { "Josh Green": { pct: 0.96, party: "DEM" }},
        _sortedWinProbabilities: [["Josh Green", { pct: 0.96, party: "DEM" }]],
        _sortedVoteEstimates:    [["Josh Green", { pct: 63, party: "DEM" }]]
    }
};