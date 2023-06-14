import React, { useEffect, useState  } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { MuiFileInput } from 'mui-file-input'
var AWS = require('aws-sdk');

const s3  = new AWS.S3({
  accessKeyId: 'kongza-test',
  secretAccessKey: 'xektagp9pYUNS3cmyI3FQ7PbKnMTG4Ar0vJA8DZA',
  endpoint: 'http://192.168.10.19:9000',
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4'
});

export default function UserList() {

  const [file, setFile] = React.useState(null)
  const [pic, setPic] = React.useState(null)

  const handleChange = (newFile) => {
    const addfile = newFile.target.files[0]
    setFile(addfile)
    alert(addfile)
    console.log(addfile)
    setPic(URL.createObjectURL(newFile.target.files[0]));
  }

    function addminio(e){
      s3.putObject(
        { Bucket: 'kongza', Key: file.name , Body: file  },
        (err, data) => {
          if (err)
            console.log(err,data);
          else
            console.log('Successfully uploaded data to kongza/kongza');
            alert('update success')
        }
      );
    }

  return (
    <Container sx={{ p:2 }} maxWidth="xl">    
      <Grid item xs={12}>

      <h2>Add Image:</h2>
      <button onClick={addminio} >save</button>

            <input type='file' multiple accept='*' onChange={handleChange}  />
            <img src={pic} style={{width: 200 ,height: 200}} />
     
            {/* <MuiFileInput value={file} onChange={handleChange} /> */}
 
    </Grid>
    </Container>
   
  );
}
