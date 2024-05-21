//draw cube class

class Cube {
    constructor(color=[1.0,1.0,1.0,1.0],tex=-1){
      this.type = 'cube';
      this.game_red = false;
      this.color = color;
      this.vertices = this.initVertexArray();
      this.vertices32 = new Float32Array(this.initVertexArray())
      this.normal_vertices = this.getNormalVertices()
      this.normal_vertices32 = new Float32Array(this.normal_vertices)
      this.matrix = new Matrix4();
      //this.drawMatrix = new Matrix4();
      this.textureNum=tex;
      this.u_whichTexture
      this.uv = []
      this.vertexBuffer = null;
      this.x;
      this.y;
      this.z;
    }

    // In initVertexArray, specify the texture coordinates (draw it out)
    // Modify the shader to use a_UV
    // Modify lines 114-121 with the correct strides and offsets
    // Modify line 80 to get the correct n


    initVertexArray(){
        let vertices = [
            // Positions            // UV Coordinates
             // Back face
            -0.5, -0.5, -0.5,        0,0,
             0.5, -0.5, -0.5,        1,0,
             0.5,  0.5, -0.5,        1,1,
             0.5,  0.5, -0.5,        1,1,
            -0.5,  0.5, -0.5,        0,1,
            -0.5, -0.5, -0.5,        0,0,

            // Front face
            -0.5, -0.5,  0.5,           0,0,
             0.5, -0.5,  0.5,           1,0,
             0.5,  0.5,  0.5,           1,1,
             0.5,  0.5,  0.5,           1,1,
            -0.5,  0.5,  0.5,           0,1,
            -0.5, -0.5,  0.5,           0,0,

            // Left Face
            -0.5,  0.5,  0.5,           0,0,
            -0.5,  0.5, -0.5,           1,0,
            -0.5, -0.5, -0.5,           1,1,
            -0.5, -0.5, -0.5,           1,1,
            -0.5, -0.5,  0.5,           0,1,
            -0.5,  0.5,  0.5,           0,0,

            //  Right Face
             0.5,  0.5,  0.5,           0,0,
             0.5,  0.5, -0.5,           1,0,
             0.5, -0.5, -0.5,           1,1,
             0.5, -0.5, -0.5,           1,1,
             0.5, -0.5,  0.5,           0,1,
             0.5,  0.5,  0.5,           0,0,

             // Bottom Face
            -0.5, -0.5, -0.5,            0,0,
             0.5, -0.5, -0.5,            1,0,
             0.5, -0.5,  0.5,            1,1,
             0.5, -0.5,  0.5,            1,1,
            -0.5, -0.5,  0.5,            0,1,
            -0.5, -0.5, -0.5,            0,0,

            // Front Face
            -0.5,  0.5, -0.5,           0,0,
             0.5,  0.5, -0.5,           1,0,
             0.5,  0.5,  0.5,           1,1,
             0.5,  0.5,  0.5,           1,1,
            -0.5,  0.5,  0.5,           0,1,
            -0.5,  0.5, -0.5,           0,0,
        ];
        return vertices;
    }
    getNormalVertices() {
        
        let old_verts = [
            -0.5, -0.5, -0.5,        
             0.5, -0.5, -0.5,  
             0.5,  0.5, -0.5,  
             0.5,  0.5, -0.5,
            -0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5, 

            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5, -0.5,  0.5,

            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
            -0.5, -0.5, -0.5, 
            -0.5, -0.5, -0.5, 
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,

             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,

            -0.5, -0.5, -0.5, 
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5, 

            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5];
        return old_verts

    }




    identity() { //resets to identity matrix
        this.matrix.elements = new Float32Array([
            1,0,0,0, 
            0,1,0,0, 
            0,0,1,0, 
            0,0,0,1]);
    }

    drawTriangleIn3D(float32vertices) {
        //var verts = this.getNormalVertices()
        // float32vertices = new Float32Array(float32vertices);
        var n = float32vertices.length / 5;
        // Create a buffer object
        if (this.vertexBuffer == null) {
            this.vertexBuffer = gl.createBuffer();
        
            if (!this.vertexBuffer){
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

        // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // if (a_Position < 0) {
        //    console.log('Failed to get the storage location of a_Position');
        //    return -1;
        //  }
        
        // var a_UV = gl.getAttribLocation(gl.program, 'a_UV');
        // if (a_UV < 0) {
        //     console.log('Failed to get the storage location of a_UV');
        //     return -1;
        // }

        var rgba = this.color
        var u_whichTexture;
        //gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the size of a point to u_Size variable

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, float32vertices, gl.DYNAMIC_DRAW);

        let FSIZE = float32vertices.BYTES_PER_ELEMENT;

        // Assign the buffer object to a_Position variable
        // -0.5, -0.5, -0.5,    0.0, 1.0, // First Vertex
        // -0.5, -0.5, -0.5,    1.0, 1.0, // Second Vertex
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        // Assign the buffer object to a_UV variable
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
        // Enable the assignment to a_UV variable
        gl.enableVertexAttribArray(a_UV);


        gl.drawArrays(gl.TRIANGLES, 0, n);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }

    drawTriangle3DUV(vertices, uv) {
        var n = vertices.length / 3;
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
           console.log('Failed to get the storage location of a_Position');
           return -1;
         }
        
        var rgba = this.color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the size of a point to u_Size variable

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices32, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        

        //UV
        
        var UVBuffer = gl.createBuffer();
        if (!UVBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }
        
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_UV);

        gl.drawArrays(gl.TRIANGLES, 0, n);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }

    drawNormalTriangleIn3D(float32vertices) {
        var n = float32vertices.length / 3;
        // Create a buffer object

        if (this.vertexBuffer == null) {
            this.vertexBuffer = gl.createBuffer();
        
            if (!this.vertexBuffer){
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

        // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // if (a_Position < 0) {
        //    console.log('Failed to get the storage location of a_Position');
        //    return -1;
        //  }
        
        var rgba = this.color
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the size of a point to u_Size variable

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, float32vertices, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        gl.drawArrays(gl.TRIANGLES, 0, n);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }

    render() {        
        if (this.textureNum == -2) {
            this.drawNormalTriangleIn3D(this.normal_vertices32);// actually nvm
        } else {
            this.drawTriangleIn3D(this.vertices32);
        }
    }

}
  