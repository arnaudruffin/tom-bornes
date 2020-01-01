#!/bin/bash
DIR=$HOME/Dropbox/BornesTom
OUT=generated-markers.json

echo '{"type": "FeatureCollection","features": [' > $OUT
for filename in $DIR/*jpg; do
  base=$(basename $filename)
  echo '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [' >> $OUT
  latitude=$(exiftool -n -gpslatitude -T $filename)
  longitude=$(exiftool -n -gpslongitude -T $filename)
  echo "$longitude , $latitude" >> $OUT
  echo '   ]}, "properties": {"prop0": "value0", "name" :  '>> $OUT
  echo " \"$base\"" >> $OUT
  echo ' }},' >> $OUT

done
echo ' ]}' >> $OUT