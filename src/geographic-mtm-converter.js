// Adapted in part from 
// http://leware.net/geo/utmgoogleapp.htm


var deg2rad = Math.PI / 180;
var rad2deg = 180.0 / Math.PI;
var pi = Math.PI;


//-------------------------------------------------------------------
// Maths functions

function mod(y, x)
{
  if (y >= 0)
    return y - x * floor(y / x);
  else
    return y + x * (floor(-y / x) + 1.0);
}

function atan2(y, x)
{
  return Math.atan2(y, x);
}

function sqrt(x)
{
  return Math.sqrt(x);
}

function tan(x)
{
  return Math.tan(x);
}

function sin(x)
{
  return Math.sin(x);
}

function cos(x)
{
  return Math.cos(x);
}

function acos(x)
{
  return Math.acos(x);
}

function floor(x)
{
  return Math.floor(x);
}

function round(x)
{
  return Math.round(x);
}

function ln(x)
{
  return Math.log(x);
}

function abs(x)
{
  return Math.abs(x);
}

function pow(x, y)
{
  return Math.pow(x, y);
}

function atan(x)
{
  return Math.atan(x);
}

function chr(x)
{
  return String.fromCharCode(x);
}

function round(x)
{
  return Math.round(x);
}

// END MATH FUNCTIONS

function geo_constants(ellipsoidName)
{
  // returns ellipsoid values
  ellipsoid_axis = new Array();
  ellipsoid_eccentricity = new Array();
  ellipsoid_axis[0] = 6377563.396; ellipsoid_eccentricity[0] = 0.00667054;  //airy
  ellipsoid_axis[1] = 6377340.189; ellipsoid_eccentricity[1] = 0.00667054;  // mod airy
  ellipsoid_axis[2] = 6378160; ellipsoid_eccentricity[2] = 0.006694542;  //aust national
  ellipsoid_axis[3] = 6377397.155; ellipsoid_eccentricity[3] = 0.006674372;  //bessel 1841
  ellipsoid_axis[4] = 6378206.4; ellipsoid_eccentricity[4] = 0.006768658;  //clarke 1866 == NAD 27 (TBC)
  ellipsoid_axis[5] = 6378249.145; ellipsoid_eccentricity[5] = 0.006803511;  //clarke 1880
  ellipsoid_axis[6] = 6377276.345; ellipsoid_eccentricity[6] = 0.00637847;  //everest
  ellipsoid_axis[7] = 6377304.063; ellipsoid_eccentricity[7] = 0.006637847;  // mod everest
  ellipsoid_axis[8] = 6378166; ellipsoid_eccentricity[8] = 0.006693422;  //fischer 1960
  ellipsoid_axis[9] = 6378150; ellipsoid_eccentricity[9] = 0.006693422;  //fischer 1968
  ellipsoid_axis[10] = 6378155; ellipsoid_eccentricity[10] = 0.006693422;  // mod fischer
  ellipsoid_axis[11] = 6378160; ellipsoid_eccentricity[11] = 0.006694605;  //grs 1967
  ellipsoid_axis[12] = 6378137; ellipsoid_eccentricity[12] = 0.00669438;  //  grs 1980
  ellipsoid_axis[13] = 6378200; ellipsoid_eccentricity[13] = 0.006693422;  // helmert 1906
  ellipsoid_axis[14] = 6378270; ellipsoid_eccentricity[14] = 0.006693422;  // hough
  ellipsoid_axis[15] = 6378388; ellipsoid_eccentricity[15] = 0.00672267;  // int24
  ellipsoid_axis[16] = 6378245; ellipsoid_eccentricity[16] = 0.006693422;  // krassovsky
  ellipsoid_axis[17] = 6378160; ellipsoid_eccentricity[17] = 0.006694542;  // s america
  ellipsoid_axis[18] = 6378165; ellipsoid_eccentricity[18] = 0.006693422;  // wgs-60
  ellipsoid_axis[19] = 6378145; ellipsoid_eccentricity[19] = 0.006694542;  // wgs-66
  ellipsoid_axis[20] = 6378135; ellipsoid_eccentricity[20] = 0.006694318;  // wgs-72
  ellipsoid_axis[21] = 6378137; ellipsoid_eccentricity[21] = 0.00669438;  //wgs-84

  //TO-DO -- turn above into objects; use ellipsoidName to grab above values?
  // for now use for current project

  ellipsoid = 21; //default is wgs-84 

  scaleTm = 0.9999; //UTM scaleTm = 0.9996;
  eastingOrg = 304800.; //UTMeastingOrg = 500000.;
 

  // return values as an object
  var ellipsoid = { axis: ellipsoid_axis[ellipsoid],
                    eccentricity: ellipsoid_eccentricity[ellipsoid],
                    eastingOrg: eastingOrg,
                    scaleTm: scaleTm
                    };
  return ellipsoid;
}


//function adapted from NSRUG  (caution: longitudes are +ve here)
function gsrugZoner(mtmLat, mtmLong, mtmZone)
{
   // Adapted from FORTRAN: SUBROUTINE ZONER(SAT,SLG,mtmZone)
   // Downloaded via below URL for Online Geodetic Tools:
   //    http://www.geod.rncan.gc.ca/tools-outils/index_e.php
   //    http://www.geod.rncan.gc.ca/tools-outils/tools_info_e.php?apps=gsrug
   // Here: C:/Docume~1/pilewis/Desktop/Lew/GPS72/GSRUG/GSRUG.FOR

   // Includes the official NSRUG Jan2008 fixes (see emails from Pat Legree)

   var mtmDegs =   // bounds for MTM zones 14 to 32
      [85.5,  88.5,  91.5,
       94.5,  97.5,  100.5,
       103.5, 106.5, 109.5,
       112.5, 115.5, 118.5,
       121.5, 124.5, 127.5,
       130.5, 133.5, 136.5,
       139.5, 142.5];

   var mtmSmers =  // MTM zone to reference meridian
      [0., 53., 56.,
                      58.5, 61.5, 64.5, 67.5, 70.5, 73.5,
       76.5, 79.5, 82.5,
                          81., 84., 87., 90., 93., 96., 99.,
       102., 105., 108., 111., 114., 117., 120., 123., 126.,
       129., 132., 135., 138., 141.];  // last was 142 ?!! I think it should be 141.

   // ? matches http://www.posc.org/Epicentre.2_2/DataModel/LogicalDictionary/StandardValues/coordinate_transformation.html

   if (mtmZone == 0)  // determine zone from lat/lon
   {
      if (mtmLong > 51.5 && mtmLong <= 54.5) mtmZone=1;

      if (mtmLong > 54.5 && mtmLong <= 57.5) mtmZone=2;

      if (mtmLat <= 46.5 && mtmLong <= 59.5 && mtmLong > 57.5 ||
          mtmLat > 46.5 && mtmLong <= 60. && mtmLong > 57.5) mtmZone=3;

      if (mtmLat < 46.5 && mtmLong <= 63. && mtmLong > 59.5 ||
          mtmLat >= 46.5 && mtmLong <= 63. && mtmLong > 60.) mtmZone=4;

      if (mtmLong > 63. && mtmLong <= 66.5 && mtmLat <= 44.75 ||
          mtmLong > 63. && mtmLat > 44.75 && mtmLong <= 66.) mtmZone=5;

      if (mtmLong > 66. && mtmLat > 44.75 && mtmLong <= 69. ||
          mtmLong > 66.5 && mtmLat <= 44.75 && mtmLong <= 69.) mtmZone=6;

      if (mtmLong > 69. && mtmLong <= 72.) mtmZone=7;

      if (mtmLong > 72. && mtmLong <= 75.) mtmZone=8;

      if (mtmLong > 75. && mtmLong <= 78.) mtmZone=9;

      if (mtmLat >  47. && mtmLong > 78. && mtmLong <= 79.5 ||
          mtmLat <= 47. && mtmLat  > 46. && mtmLong > 78. && mtmLong <= 80.25 ||
          mtmLat <= 46. && mtmLong > 78. && mtmLong <= 81.) mtmZone=10;

      if (mtmLong > 81. && mtmLong <= 84. && mtmLat <= 46.) mtmZone=11;

      if (mtmLong > 79.5  && mtmLong <= 82.5 && mtmLat > 47. ||
          mtmLong > 80.25 && mtmLong <= 82.5 && mtmLat <= 47. && mtmLat > 46.) mtmZone= 12;

      // if (mtmLong > 82.5 && mtmLong <= 85.5 && mtmLat > 46. ||
      //     mtmLong > 84. && mtmLong <= 85.5 && mtmLat <= 46.) mtmZone=13;

      if (mtmLong > 82.5 && mtmLong <= 85.5 && mtmLat > 46.) mtmZone=13;

      if (mtmZone == 0) // still not found, try regular Western Canada
      {
         for (var z = 0; z <= 18; ++z)
         {
            if (mtmLong > mtmDegs[z] && mtmLong <= mtmDegs[z+1])
            {
               mtmZone = z+14;
               break;
            }
         }
      }
   }

   if (mtmZone < 1 || mtmZone > 32)
   {
      alert("Cannot figure out MTM zone -- outside Canada, lat=" + mtmLat + ", lon=" + mtmLong);
      var mtmZoner = {zone: 0 , refMeridian: -mtmLong};  // return something not totally insane
      return mtmZoner;
   }
   else
   {
      var mtmZoner = {zone: mtmZone , refMeridian: -mtmSmers[Number(mtmZone)]};
      return mtmZoner;
   }
}



function convertMTM(zone, hemisphere, xCoord, yCoord)
{
  var meridian = 0.0 // TODO: important for later on -- do not need for this project
  var northing = yCoord;
  var easting = xCoord;
  var ellipsoidName = "WGS-84"

  var ellipsoid = geo_constants(ellipsoidName);

  var axis = ellipsoid.axis;
  var eccent = ellipsoid.eccentricity;
  var scaleTm = ellipsoid.scaleTm;
  var eastingOrg = ellipsoid.eastingOrg;

  var e1 = (1 - sqrt(1 - eccent)) / (1 + sqrt(1 - eccent));
  var eastingOffset = easting - eastingOrg; //remove 500,000 meter offset for longitude
  


  var longorig = (zone - 1) * 6 - 180 + 3;  //+3 puts origin in middle of zone

  // @dc 180 - (7+76) * 3 - 1.5
  if (scaleTm == 0.9999)
  {
      // longorig = 180 - (zone*1 + 76) * 3 - 1.5;  // without hack, did string concat !!!
      if (meridian == 0)
      {
         zonerResult = gsrugZoner(0., 0., zone);
         longorig = zonerResult.refMeridian;
      }
      else
         longorig = meridian;
  }

  // alert("zone = " + (zone*1 + 76));
  // alert("longorig = " + longorig);

  var eccPrimeSquared = (eccent) / (1-eccent);
  var M = northing / scaleTm;
  var mu = M / (axis * (1 - eccent / 4 - 3 * eccent * eccent / 64 - 5 * eccent * eccent * eccent / 256));
  var phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * sin(6 * mu);
  var phi1 = phi1Rad * rad2deg;
  var N1 = axis / sqrt(1 - eccent * sin(phi1Rad) * sin(phi1Rad));

  var T1 = tan(phi1Rad) * tan(phi1Rad);
  var C1 = eccPrimeSquared * cos(phi1Rad) * cos(phi1Rad);
  var R1 = axis * (1 - eccent) / pow(1-eccent * sin(phi1Rad) * sin(phi1Rad), 1.5);
  var D = eastingOffset / (N1 * scaleTm);
  
  var lat = phi1Rad - (N1 * tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = lat * rad2deg;
  
  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / cos(phi1Rad);
  lon = longorig + lon * rad2deg;

  console.log(lat, lon)  
  
}
