//draw cube class

class Cube {
    constructor(color=[1.0,1.0,1.0,1.0],tex=-1){
      this.type = 'cube';
      this.game_red = false;
      this.color = color;
      this.matrix = new Matrix4();
      this.noNorms = new Float32Array(this.getVertsNoNorms())
      this.vert = new Float32Array(this.initVertexArray())
      this.textureNum=tex;
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
             // Positions            // UV Coordinates   //Normals
             // Back face
            -0.5, -0.5, -0.5,        0,0,               0,0,-1,
             0.5, -0.5, -0.5,        1,0,               0,0,-1,
             0.5,  0.5, -0.5,        1,1,               0,0,-1,
             0.5,  0.5, -0.5,        1,1,               0,0,-1,
            -0.5,  0.5, -0.5,        0,1,               0,0,-1,
            -0.5, -0.5, -0.5,        0,0,               0,0,-1,

            // Front face
            -0.5, -0.5,  0.5,           0,0,               0,0,1,
             0.5, -0.5,  0.5,           1,0,               0,0,1,
             0.5,  0.5,  0.5,           1,1,               0,0,1,
             0.5,  0.5,  0.5,           1,1,               0,0,1,
            -0.5,  0.5,  0.5,           0,1,               0,0,1,
            -0.5, -0.5,  0.5,           0,0,               0,0,1,

            // Left Face
            -0.5,  0.5,  0.5,           0,0,               -1,0,0,
            -0.5,  0.5, -0.5,           1,0,               -1,0,0,
            -0.5, -0.5, -0.5,           1,1,               -1,0,0,
            -0.5, -0.5, -0.5,           1,1,               -1,0,0,
            -0.5, -0.5,  0.5,           0,1,               -1,0,0,
            -0.5,  0.5,  0.5,           0,0,               -1,0,0,

            //  Right Face
             0.5,  0.5,  0.5,           0,0,               1,0,0,
             0.5,  0.5, -0.5,           1,0,               1,0,0,
             0.5, -0.5, -0.5,           1,1,               1,0,0,
             0.5, -0.5, -0.5,           1,1,               1,0,0,
             0.5, -0.5,  0.5,           0,1,               1,0,0,
             0.5,  0.5,  0.5,           0,0,               1,0,0,

             // Bottom Face
            -0.5, -0.5, -0.5,            0,0,               0,-1,0,
             0.5, -0.5, -0.5,            1,0,               0,-1,0,
             0.5, -0.5,  0.5,            1,1,               0,-1,0,
             0.5, -0.5,  0.5,            1,1,               0,-1,0,
            -0.5, -0.5,  0.5,            0,1,               0,-1,0,
            -0.5, -0.5, -0.5,            0,0,               0,-1,0,

            // Top Face
            -0.5,  0.5, -0.5,           0,0,               0,1,0,
             0.5,  0.5, -0.5,           1,0,               0,1,0,
             0.5,  0.5,  0.5,           1,1,               0,1,0,
             0.5,  0.5,  0.5,           1,1,               0,1,0,
            -0.5,  0.5,  0.5,           0,1,               0,1,0,
            -0.5,  0.5, -0.5,           0,0,               0,1,0,
        ];
        return vertices;
    }

    getVertsNoNorms() {
        return [
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

            // Top Face
            -0.5,  0.5, -0.5,           0,0,
             0.5,  0.5, -0.5,           1,0,
             0.5,  0.5,  0.5,           1,1,
             0.5,  0.5,  0.5,           1,1,
            -0.5,  0.5,  0.5,           0,1,
            -0.5,  0.5, -0.5,           0,0,
        ];
    }




    drawTriangleIn3D(float32vertices) {
        //var verts = this.getNormalVertices()
        // float32vertices = new Float32Array(float32vertices);
        var n = float32vertices.length / 8;
        // Create a buffer object
        if (this.vertexBuffer == null) {
            this.vertexBuffer = gl.createBuffer();
        
            if (!this.vertexBuffer){
                console.log('Failed to create the buffer object');
                return -1;
            }
        }
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
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        // Assign the buffer object to a_UV variable
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_UV variable
        gl.enableVertexAttribArray(a_UV);
        
        
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        gl.enableVertexAttribArray(a_Normal);


        gl.drawArrays(gl.TRIANGLES, 0, n);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }
    drawTriangleIn3DNoNormals(float32vertices) {

        var n = float32vertices.length / 5;
        // Create a buffer object
        if (this.vertexBuffer == null) {
            this.vertexBuffer = gl.createBuffer();
        
            if (!this.vertexBuffer){
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

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
x
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



    render(is_normal) {        
        // if (this.textureNum == -2) {
        //     this.drawNormalTriangleIn3D(this.getVertsNoNorms);// actually nvm
        // } else 
        // if (is_normal) {
            this.drawTriangleIn3D(this.vert);
        // } else if (!is_normal) {
        //     this.drawTriangleIn3DNoNormals(this.noNorms)
        // }
    }

}
  