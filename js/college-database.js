// ===================================
// College Database - US Undergraduate Institutions
// ===================================
// This database contains popular US colleges with their locations and typical application deadlines

// College URL mapping for direct navigation
const COLLEGE_URLS = {
    "Harvard University": "https://www.harvard.edu",
    "Yale University": "https://www.yale.edu",
    "Princeton University": "https://www.princeton.edu",
    "Columbia University": "https://www.columbia.edu",
    "University of Pennsylvania": "https://www.upenn.edu",
    "Brown University": "https://www.brown.edu",
    "Dartmouth College": "https://www.dartmouth.edu",
    "Cornell University": "https://www.cornell.edu",
    "Stanford University": "https://www.stanford.edu",
    "Massachusetts Institute of Technology": "https://www.mit.edu",
    "California Institute of Technology": "https://www.caltech.edu",
    "Duke University": "https://www.duke.edu",
    "Northwestern University": "https://www.northwestern.edu",
    "Johns Hopkins University": "https://www.jhu.edu",
    "University of Chicago": "https://www.uchicago.edu",
    "Vanderbilt University": "https://www.vanderbilt.edu",
    "Rice University": "https://www.rice.edu",
    "Washington University in St. Louis": "https://wustl.edu",
    "Emory University": "https://www.emory.edu",
    "Georgetown University": "https://www.georgetown.edu",
    "Carnegie Mellon University": "https://www.cmu.edu",
    "University of Notre Dame": "https://www.nd.edu",
    "University of Southern California": "https://www.usc.edu",
    "New York University": "https://www.nyu.edu",
    "Boston University": "https://www.bu.edu",
    "Boston College": "https://www.bc.edu",
    "Tufts University": "https://www.tufts.edu",
    "University of California, Berkeley": "https://www.berkeley.edu",
    "University of California, Los Angeles": "https://www.ucla.edu",
    "University of California, San Diego": "https://www.ucsd.edu",
    "University of California, Santa Barbara": "https://www.ucsb.edu",
    "University of California, Irvine": "https://www.uci.edu",
    "University of California, Davis": "https://www.ucdavis.edu",
    "University of California, Santa Cruz": "https://www.ucsc.edu",
    "University of California, Riverside": "https://www.ucr.edu",
    "University of California, Merced": "https://www.ucmerced.edu",
    "University of Michigan": "https://www.umich.edu",
    "University of Virginia": "https://www.virginia.edu",
    "University of North Carolina at Chapel Hill": "https://www.unc.edu",
    "University of Florida": "https://www.ufl.edu",
    "University of Texas at Austin": "https://www.utexas.edu",
    "University of Washington": "https://www.washington.edu",
    "University of Wisconsin-Madison": "https://www.wisc.edu",
    "University of Illinois Urbana-Champaign": "https://illinois.edu",
    "Ohio State University": "https://www.osu.edu",
    "Pennsylvania State University": "https://www.psu.edu",
    "Purdue University": "https://www.purdue.edu",
    "University of Maryland": "https://www.umd.edu",
    "University of Georgia": "https://www.uga.edu",
    "Georgia Institute of Technology": "https://www.gatech.edu",
    "Northeastern University": "https://www.northeastern.edu",
    "Tulane University": "https://tulane.edu",
    "University of Miami": "https://welcome.miami.edu",
    "University of Rochester": "https://www.rochester.edu",
    "Case Western Reserve University": "https://case.edu",
    "Lehigh University": "https://www.lehigh.edu",
    "Rensselaer Polytechnic Institute": "https://www.rpi.edu",
    "University of Pittsburgh": "https://www.pitt.edu",
    "Syracuse University": "https://www.syracuse.edu",
    "Fordham University": "https://www.fordham.edu",
    "Villanova University": "https://www.villanova.edu",
    "Wake Forest University": "https://www.wfu.edu",
    "Williams College": "https://www.williams.edu",
    "Amherst College": "https://www.amherst.edu",
    "Swarthmore College": "https://www.swarthmore.edu",
    "Pomona College": "https://www.pomona.edu",
    "Claremont McKenna College": "https://www.cmc.edu",
    "Wellesley College": "https://www.wellesley.edu",
    "Bowdoin College": "https://www.bowdoin.edu",
    "Middlebury College": "https://www.middlebury.edu",
    "Colgate University": "https://www.colgate.edu",
    "Washington State University": "https://wsu.edu",
    "Seattle University": "https://www.seattleu.edu",
    "Gonzaga University": "https://www.gonzaga.edu"
};

// Function to get college URL
function getCollegeURL(collegeName) {
    return COLLEGE_URLS[collegeName] || `https://www.google.com/search?q=${encodeURIComponent(collegeName)}`;
}

const COLLEGE_DATABASE = [
    // Ivy League - All accept Common App
    { name: "Harvard University", location: "Cambridge, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Yale University", location: "New Haven, CT", state: "CT", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Princeton University", location: "Princeton, NJ", state: "NJ", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Columbia University", location: "New York, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "University of Pennsylvania", location: "Philadelphia, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "01-05", commonApp: true },
    { name: "Brown University", location: "Providence, RI", state: "RI", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    { name: "Dartmouth College", location: "Hanover, NH", state: "NH", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Cornell University", location: "Ithaca, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    
    // Top Private Universities - Most accept Common App
    { name: "Stanford University", location: "Stanford, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-05", commonApp: true },
    { name: "Massachusetts Institute of Technology", location: "Cambridge, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "California Institute of Technology", location: "Pasadena, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    { name: "Duke University", location: "Durham, NC", state: "NC", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Northwestern University", location: "Evanston, IL", state: "IL", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Johns Hopkins University", location: "Baltimore, MD", state: "MD", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    { name: "University of Chicago", location: "Chicago, IL", state: "IL", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Vanderbilt University", location: "Nashville, TN", state: "TN", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Rice University", location: "Houston, TX", state: "TX", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Washington University in St. Louis", location: "St. Louis, MO", state: "MO", earlyDeadline: "11-01", regularDeadline: "01-02", commonApp: true },
    { name: "Emory University", location: "Atlanta, GA", state: "GA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Georgetown University", location: "Washington, DC", state: "DC", earlyDeadline: "11-01", regularDeadline: "01-10", commonApp: false },
    { name: "Carnegie Mellon University", location: "Pittsburgh, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    { name: "University of Notre Dame", location: "Notre Dame, IN", state: "IN", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "University of Southern California", location: "Los Angeles, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "New York University", location: "New York, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-05", commonApp: true },
    { name: "Boston University", location: "Boston, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-04", commonApp: true },
    { name: "Boston College", location: "Chestnut Hill, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Tufts University", location: "Medford, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    
    // Top Public Universities (UC System) - Use UC Application
    { name: "University of California, Berkeley", location: "Berkeley, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Los Angeles", location: "Los Angeles, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, San Diego", location: "La Jolla, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Santa Barbara", location: "Santa Barbara, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Irvine", location: "Irvine, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Davis", location: "Davis, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Santa Cruz", location: "Santa Cruz, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Riverside", location: "Riverside, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    { name: "University of California, Merced", location: "Merced, CA", state: "CA", earlyDeadline: null, regularDeadline: "11-30", commonApp: false },
    
    // Top Public Universities (Other States) - Most accept Common App
    { name: "University of Michigan", location: "Ann Arbor, MI", state: "MI", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Virginia", location: "Charlottesville, VA", state: "VA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "University of North Carolina at Chapel Hill", location: "Chapel Hill, NC", state: "NC", earlyDeadline: "10-15", regularDeadline: "01-15", commonApp: true },
    { name: "Georgia Institute of Technology", location: "Atlanta, GA", state: "GA", earlyDeadline: "11-01", regularDeadline: "01-04", commonApp: true },
    { name: "University of Florida", location: "Gainesville, FL", state: "FL", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Texas at Austin", location: "Austin, TX", state: "TX", earlyDeadline: null, regularDeadline: "12-01", commonApp: false },
    { name: "University of Washington", location: "Seattle, WA", state: "WA", earlyDeadline: null, regularDeadline: "11-15", commonApp: true },
    { name: "University of Wisconsin-Madison", location: "Madison, WI", state: "WI", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Illinois at Urbana-Champaign", location: "Urbana, IL", state: "IL", earlyDeadline: "11-01", regularDeadline: "01-05", commonApp: true },
    { name: "Ohio State University", location: "Columbus, OH", state: "OH", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "Penn State University", location: "University Park, PA", state: "PA", earlyDeadline: null, regularDeadline: "11-01", commonApp: true },
    { name: "Purdue University", location: "West Lafayette, IN", state: "IN", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Maryland", location: "College Park, MD", state: "MD", earlyDeadline: "11-01", regularDeadline: "01-20", commonApp: true },
    { name: "University of Minnesota", location: "Minneapolis, MN", state: "MN", earlyDeadline: null, regularDeadline: "01-01", commonApp: true },
    { name: "Texas A&M University", location: "College Station, TX", state: "TX", earlyDeadline: null, regularDeadline: "12-01", commonApp: false },
    { name: "Rutgers University", location: "New Brunswick, NJ", state: "NJ", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Pittsburgh", location: "Pittsburgh, PA", state: "PA", earlyDeadline: null, regularDeadline: "01-15", commonApp: true },
    { name: "Virginia Tech", location: "Blacksburg, VA", state: "VA", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Connecticut", location: "Storrs, CT", state: "CT", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Massachusetts Amherst", location: "Amherst, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "Indiana University Bloomington", location: "Bloomington, IN", state: "IN", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "Michigan State University", location: "East Lansing, MI", state: "MI", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Iowa", location: "Iowa City, IA", state: "IA", earlyDeadline: null, regularDeadline: "01-15", commonApp: true },
    { name: "University of Delaware", location: "Newark, DE", state: "DE", earlyDeadline: "11-15", regularDeadline: "01-15", commonApp: true },
    { name: "University of Georgia", location: "Athens, GA", state: "GA", earlyDeadline: "10-15", regularDeadline: "01-01", commonApp: true },
    { name: "University of Colorado Boulder", location: "Boulder, CO", state: "CO", earlyDeadline: "11-15", regularDeadline: "01-15", commonApp: true },
    { name: "University of Oregon", location: "Eugene, OR", state: "OR", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "Arizona State University", location: "Tempe, AZ", state: "AZ", earlyDeadline: null, regularDeadline: "02-01", commonApp: true },
    { name: "University of Arizona", location: "Tucson, AZ", state: "AZ", earlyDeadline: null, regularDeadline: "05-01", commonApp: true },
    { name: "University of Utah", location: "Salt Lake City, UT", state: "UT", earlyDeadline: null, regularDeadline: "04-01", commonApp: true },
    { name: "University of Kansas", location: "Lawrence, KS", state: "KS", earlyDeadline: null, regularDeadline: "05-01", commonApp: true },
    { name: "University of Missouri", location: "Columbia, MO", state: "MO", earlyDeadline: null, regularDeadline: "05-01", commonApp: true },
    { name: "University of Nebraska-Lincoln", location: "Lincoln, NE", state: "NE", earlyDeadline: null, regularDeadline: "01-15", commonApp: true },
    { name: "University of Oklahoma", location: "Norman, OK", state: "OK", earlyDeadline: null, regularDeadline: "02-01", commonApp: true },
    { name: "University of Tennessee", location: "Knoxville, TN", state: "TN", earlyDeadline: null, regularDeadline: "12-15", commonApp: true },
    { name: "University of Kentucky", location: "Lexington, KY", state: "KY", earlyDeadline: null, regularDeadline: "02-15", commonApp: true },
    { name: "University of South Carolina", location: "Columbia, SC", state: "SC", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Alabama", location: "Tuscaloosa, AL", state: "AL", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Arkansas", location: "Fayetteville, AR", state: "AR", earlyDeadline: "11-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Mississippi", location: "Oxford, MS", state: "MS", earlyDeadline: null, regularDeadline: "02-01", commonApp: true },
    { name: "Louisiana State University", location: "Baton Rouge, LA", state: "LA", earlyDeadline: null, regularDeadline: "12-15", commonApp: true },
    { name: "Auburn University", location: "Auburn, AL", state: "AL", earlyDeadline: null, regularDeadline: "02-01", commonApp: true },
    { name: "Clemson University", location: "Clemson, SC", state: "SC", earlyDeadline: "10-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of Vermont", location: "Burlington, VT", state: "VT", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "University of New Hampshire", location: "Durham, NH", state: "NH", earlyDeadline: "11-15", regularDeadline: "02-01", commonApp: true },
    { name: "University of Rhode Island", location: "Kingston, RI", state: "RI", earlyDeadline: "12-01", regularDeadline: "02-01", commonApp: true },
    { name: "University of Maine", location: "Orono, ME", state: "ME", earlyDeadline: "12-01", regularDeadline: "02-01", commonApp: true },
    
    // Liberal Arts Colleges - All accept Common App
    { name: "Williams College", location: "Williamstown, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Amherst College", location: "Amherst, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01", commonApp: true },
    { name: "Swarthmore College", location: "Swarthmore, PA", state: "PA", earlyDeadline: "11-15", regularDeadline: "01-03", commonApp: true },
    { name: "Pomona College", location: "Claremont, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-08", commonApp: true },
    { name: "Wellesley College", location: "Wellesley, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-15", commonApp: true },
    { name: "Bowdoin College", location: "Brunswick, ME", state: "ME", earlyDeadline: "11-15", regularDeadline: "01-05", commonApp: true },
    { name: "Carleton College", location: "Northfield, MN", state: "MN", earlyDeadline: "11-15", regularDeadline: "01-15", commonApp: true },
    { name: "Middlebury College", location: "Middlebury, VT", state: "VT", earlyDeadline: "11-01", regularDeadline: "01-03", commonApp: true },
    { name: "Claremont McKenna College", location: "Claremont, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-08", commonApp: true },
    { name: "Haverford College", location: "Haverford, PA", state: "PA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Davidson College", location: "Davidson, NC", state: "NC", earlyDeadline: "11-15", regularDeadline: "01-03" },
    { name: "Vassar College", location: "Poughkeepsie, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "01-01" },
    { name: "Colgate University", location: "Hamilton, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Hamilton College", location: "Clinton, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "01-03" },
    { name: "Harvey Mudd College", location: "Claremont, CA", state: "CA", earlyDeadline: "11-15", regularDeadline: "01-05" },
    { name: "Bates College", location: "Lewiston, ME", state: "ME", earlyDeadline: "11-15", regularDeadline: "01-03" },
    { name: "Colby College", location: "Waterville, ME", state: "ME", earlyDeadline: "11-15", regularDeadline: "01-04" },
    { name: "Grinnell College", location: "Grinnell, IA", state: "IA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Smith College", location: "Northampton, MA", state: "MA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Washington and Lee University", location: "Lexington, VA", state: "VA", earlyDeadline: "11-01", regularDeadline: "01-01" },
    { name: "Wesleyan University", location: "Middletown, CT", state: "CT", earlyDeadline: "11-15", regularDeadline: "01-01" },
    { name: "Oberlin College", location: "Oberlin, OH", state: "OH", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Macalester College", location: "St. Paul, MN", state: "MN", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Barnard College", location: "New York, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-04" },
    { name: "Bryn Mawr College", location: "Bryn Mawr, PA", state: "PA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    
    // Additional Universities
    { name: "Northeastern University", location: "Boston, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-01" },
    { name: "University of Miami", location: "Coral Gables, FL", state: "FL", earlyDeadline: "11-01", regularDeadline: "01-01" },
    { name: "Tulane University", location: "New Orleans, LA", state: "LA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Case Western Reserve University", location: "Cleveland, OH", state: "OH", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Lehigh University", location: "Bethlehem, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "01-01" },
    { name: "Rensselaer Polytechnic Institute", location: "Troy, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "University of Rochester", location: "Rochester, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-05" },
    { name: "Syracuse University", location: "Syracuse, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "01-01" },
    { name: "Pepperdine University", location: "Malibu, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Fordham University", location: "Bronx, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-08" },
    { name: "Wake Forest University", location: "Winston-Salem, NC", state: "NC", earlyDeadline: "11-15", regularDeadline: "01-01" },
    { name: "Villanova University", location: "Villanova, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Santa Clara University", location: "Santa Clara, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-07" },
    { name: "Loyola Marymount University", location: "Los Angeles, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Southern Methodist University", location: "Dallas, TX", state: "TX", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Baylor University", location: "Waco, TX", state: "TX", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Texas Christian University", location: "Fort Worth, TX", state: "TX", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "University of San Diego", location: "San Diego, CA", state: "CA", earlyDeadline: "11-15", regularDeadline: "12-15" },
    { name: "American University", location: "Washington, DC", state: "DC", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "George Washington University", location: "Washington, DC", state: "DC", earlyDeadline: "11-01", regularDeadline: "01-05" },
    { name: "Marquette University", location: "Milwaukee, WI", state: "WI", earlyDeadline: "12-01", regularDeadline: "02-01" },
    { name: "DePaul University", location: "Chicago, IL", state: "IL", earlyDeadline: "11-15", regularDeadline: "02-01" },
    { name: "Drexel University", location: "Philadelphia, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Stevens Institute of Technology", location: "Hoboken, NJ", state: "NJ", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Worcester Polytechnic Institute", location: "Worcester, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Babson College", location: "Wellesley, MA", state: "MA", earlyDeadline: "11-01", regularDeadline: "01-02" },
    { name: "Bentley University", location: "Waltham, MA", state: "MA", earlyDeadline: "11-15", regularDeadline: "01-07" },
    { name: "College of William & Mary", location: "Williamsburg, VA", state: "VA", earlyDeadline: "11-01", regularDeadline: "01-01" },
    { name: "University of Richmond", location: "Richmond, VA", state: "VA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Chapman University", location: "Orange, CA", state: "CA", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "Gonzaga University", location: "Spokane, WA", state: "WA", earlyDeadline: "11-15", regularDeadline: "02-01" },
    { name: "Seattle University", location: "Seattle, WA", state: "WA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "University of Portland", location: "Portland, OR", state: "OR", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "University of Denver", location: "Denver, CO", state: "CO", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "University of San Francisco", location: "San Francisco, CA", state: "CA", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Loyola University Chicago", location: "Chicago, IL", state: "IL", earlyDeadline: "12-01", regularDeadline: "02-01" },
    { name: "University of Dayton", location: "Dayton, OH", state: "OH", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Miami University", location: "Oxford, OH", state: "OH", earlyDeadline: "11-15", regularDeadline: "02-01" },
    { name: "University of Tulsa", location: "Tulsa, OK", state: "OK", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Creighton University", location: "Omaha, NE", state: "NE", earlyDeadline: "11-01", regularDeadline: "02-15" },
    { name: "Howard University", location: "Washington, DC", state: "DC", earlyDeadline: "11-01", regularDeadline: "02-15" },
    { name: "Spelman College", location: "Atlanta, GA", state: "GA", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Morehouse College", location: "Atlanta, GA", state: "GA", earlyDeadline: "11-01", regularDeadline: "02-15" },
    { name: "Florida State University", location: "Tallahassee, FL", state: "FL", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "University of Central Florida", location: "Orlando, FL", state: "FL", earlyDeadline: null, regularDeadline: "05-01" },
    { name: "University of South Florida", location: "Tampa, FL", state: "FL", earlyDeadline: null, regularDeadline: "03-01" },
    { name: "Florida International University", location: "Miami, FL", state: "FL", earlyDeadline: null, regularDeadline: "11-01" },
    { name: "North Carolina State University", location: "Raleigh, NC", state: "NC", earlyDeadline: "10-15", regularDeadline: "01-15" },
    { name: "Iowa State University", location: "Ames, IA", state: "IA", earlyDeadline: null, regularDeadline: "02-01" },
    { name: "Kansas State University", location: "Manhattan, KS", state: "KS", earlyDeadline: null, regularDeadline: "05-01" },
    { name: "Oklahoma State University", location: "Stillwater, OK", state: "OK", earlyDeadline: null, regularDeadline: "02-01" },
    { name: "Oregon State University", location: "Corvallis, OR", state: "OR", earlyDeadline: null, regularDeadline: "02-01" },
    { name: "Washington State University", location: "Pullman, WA", state: "WA", earlyDeadline: null, regularDeadline: "01-31" },
    { name: "Colorado State University", location: "Fort Collins, CO", state: "CO", earlyDeadline: "12-01", regularDeadline: "02-01" },
    { name: "University of Idaho", location: "Moscow, ID", state: "ID", earlyDeadline: null, regularDeadline: "05-01" },
    { name: "Montana State University", location: "Bozeman, MT", state: "MT", earlyDeadline: null, regularDeadline: "03-01" },
    { name: "University of Montana", location: "Missoula, MT", state: "MT", earlyDeadline: null, regularDeadline: "03-01" },
    { name: "University of Wyoming", location: "Laramie, WY", state: "WY", earlyDeadline: null, regularDeadline: "03-01" },
    { name: "University of Nevada, Reno", location: "Reno, NV", state: "NV", earlyDeadline: null, regularDeadline: "05-01" },
    { name: "University of Nevada, Las Vegas", location: "Las Vegas, NV", state: "NV", earlyDeadline: null, regularDeadline: "02-01" },
    { name: "Boise State University", location: "Boise, ID", state: "ID", earlyDeadline: null, regularDeadline: "05-01" },
    { name: "University of New Mexico", location: "Albuquerque, NM", state: "NM", earlyDeadline: null, regularDeadline: "06-15" },
    { name: "New Mexico State University", location: "Las Cruces, NM", state: "NM", earlyDeadline: null, regularDeadline: "08-01" },
    { name: "University of Hawaii at Manoa", location: "Honolulu, HI", state: "HI", earlyDeadline: null, regularDeadline: "01-05" },
    { name: "University of Alaska Fairbanks", location: "Fairbanks, AK", state: "AK", earlyDeadline: null, regularDeadline: "06-15" },
    { name: "Temple University", location: "Philadelphia, PA", state: "PA", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Stony Brook University", location: "Stony Brook, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "01-15" },
    { name: "Binghamton University", location: "Binghamton, NY", state: "NY", earlyDeadline: "11-01", regularDeadline: "01-15" },
    { name: "University at Buffalo", location: "Buffalo, NY", state: "NY", earlyDeadline: "11-15", regularDeadline: "02-01" },
    { name: "University of Cincinnati", location: "Cincinnati, OH", state: "OH", earlyDeadline: "11-01", regularDeadline: "02-01" },
    { name: "Kent State University", location: "Kent, OH", state: "OH", earlyDeadline: null, regularDeadline: "05-01" },
];

// Helper functions for searching and filtering
function searchColleges(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return COLLEGE_DATABASE;
    
    return COLLEGE_DATABASE.filter(college => 
        college.name.toLowerCase().includes(searchTerm) ||
        college.location.toLowerCase().includes(searchTerm) ||
        college.state.toLowerCase().includes(searchTerm)
    );
}

function getCollegeByName(name) {
    return COLLEGE_DATABASE.find(college => 
        college.name.toLowerCase() === name.toLowerCase()
    );
}

function getCollegesByState(state) {
    return COLLEGE_DATABASE.filter(college => 
        college.state === state.toUpperCase()
    );
}

// Format deadline for display (MM-DD format to readable format)
function formatDeadline(deadline) {
    if (!deadline) return null;
    const [month, day] = deadline.split('-');
    const currentYear = new Date().getFullYear();
    const academicYear = parseInt(month) >= 8 ? currentYear : currentYear + 1;
    return `${academicYear}-${month}-${day}`;
}

// Auto-populate commonApp flag for colleges that don't have it specified
// Most colleges accept Common App, so we default to true unless explicitly false
COLLEGE_DATABASE.forEach(college => {
    if (college.commonApp === undefined) {
        // Default to true for most colleges
        // Specific exclusions: UC system, Georgetown, UT Austin, Texas A&M use their own systems
        const nonCommonAppColleges = [
            'University of California',
            'Georgetown University',
            'University of Texas at Austin',
            'Texas A&M University'
        ];
        
        const usesOwnSystem = nonCommonAppColleges.some(name => college.name.includes(name));
        college.commonApp = !usesOwnSystem;
    }
});
