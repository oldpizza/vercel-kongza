import React, { useEffect, useState  } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
var AWS = require('aws-sdk');

const s3  = new AWS.S3({
  accessKeyId: 'kongza1234',
  secretAccessKey: 'kongza1234',
  endpoint: 'http://192.168.10.19:9000',
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4'
});

export default function Addpic() {

  const [file, setFile] = useState(null)
  const [pic, setPic] = useState(null)

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
    let i = 0;
    const [dataStream, setdataStream] = useState(null)
    useEffect(() => {
      s3.listObjects(
        {Bucket: 'kongza'}, 
        (err, dataStream) =>{
        console.log(dataStream.Contents)
        setdataStream(dataStream.Contents)
      });
    }, [])
    for (i in dataStream) {
      console.log(dataStream[i].Key);
      s3.getObject(
        {Bucket: 'kongza', Key: dataStream[i].Key}, 
        (err, dataStream) =>{
        
      });
    }


  return (
    <Container sx={{ p:2 }} maxWidth="xl">    
      <Grid item xs={12}>

      <h2>Add Image:</h2>
      <button onClick={addminio} >save</button>
            <input type='file'  multiple accept='*' onChange={handleChange}  />
            <img src= {pic} style={{width: 200 ,height: 200}} /><br></br>
       <div>
             {/* {dataStream.map((user) => (
            <img key={user} src= {'http://192.168.10.19:9000/kongza/'+user.Key}
             style={{width: 200 ,height: 200}} />
      ))} */}
      </div>     
    </Grid>
    </Container>
   
  );
}
