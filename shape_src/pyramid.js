//draw cube class

class Pyramid {
    constructor(color=[1.0,1.0,1.0,1.0],position=[]){
      this.type = 'cube';
      this.color = color;
      this.position = position;
      this.vertices = this.initVertexArray()
      this.matrix = new Matrix4()
      this.drawMatrix = new Matrix4()
    }

    initVertexArray(){
        let vertices = [

            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.0,  0.5,  0.0,

             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
             0.0,  0.5,  0.0,

             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
             0.0,  0.5,  0.0,

            -0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,
             0.0,  0.5,  0.0,


            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
            -0.5, -0.5, -0.5,


        ];
        

        return vertices;
    }

    identity() { //resets to identity matrix
        this.matrix.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }
    setUp() {

    }
    drawTriangleIn3D(vertices) {
        var n;
        if (vertices == null) {
            n = 3;
        } else {
            n = vertices.length / 3;
        }
        //console.log(n);
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.TRIANGLES, 0, n);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);    
    }

    render() {
        this.drawTriangleIn3D(this.vertices)
        // this.matrix.rotate(90, 1, 0, 0);
        // this.drawFace();
        // this.matrix.rotate(-90, 0, 1, 0)
        // this.matrix.rotate(-90, 0, 1, 0);   
        // this.matrix.scale(.67, 1, 1)
        // this.matrix.elements[0] = 0;           
        // this.matrix.elements[9] = 0;
        // this.drawTriangleIn3D();
            // this.color = [1, 0, 1,1]
            // this.matrix.rotate(90, 0, 1, 0);   
            // // this.drawTriangleIn3D([
            // //     0.0, 0.0, 0.0, 
            // //     1.0, 1.0, 0.0,
            // //     1.5, 0.0, 0.0]);
            // this.color = [0, 1, 1,1]
            // this.matrix.rotate(90, 0, 1, 0);
            // this.matrix.translate(-1.5, 0, 0)
            // this.matrix.rotate(270, 0, 1, 0);  
            // this.matrix.scale(.67, 1, 1)
            // this.drawTriangleIn3D([
            //     0.0, 0.0, 0.0, 
            //     1.0, 1.0, 0.0,
            //     1.5, 0.0, 0.0]);
            
            // this.color = [1, 1, 0,1];
            // this.matrix.rotate(90, 0, 1, 0);  
            // this.matrix.translate(0, 0, 1.5);
            // this.drawTriangleIn3D([
            //     0.0, 0.0, 0.0, 
            //     1.0, 1.0, 0.0,
            //     1.5, 0.0, 0.0]);
            
            // this.matrix.translate(1.5, 0, 0);  
            // this.matrix.rotate(90, 0, 1, 0)
            // this.color = [1, 0, 1,1];
            // this.drawTriangleIn3D([
            //     0.0, 0.0, 0.0, 
            //     1.0, 1.0, 0.0,
            //     1.5, 0.0, 0.0]);
    }

    drawFace() {
        this.drawTriangleIn3D([
            0.0, 0.0, 0.0, 
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0]);
    }

}
  