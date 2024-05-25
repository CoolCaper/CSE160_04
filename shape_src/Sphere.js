//draw cube class

class Sphere {
    constructor(color=[1.0,1.0,1.0,1.0],tex=-1){    
      this.color = color;
      this.type = 'sphere';
      this.verts32 = new Float32Array([])
      this.uv = new Float32Array([0,0,0,0,0,0])
      this.matrix = new Matrix4();
      this.textureNum=tex;
      this.all_verts = []
      this.vertsNoNorms = [];
      this.NoNorms32;
      this.uv_verts = []
      this.debug = [];
      this.norms = [];
      this.getSphereVerts()
      this.all_verts = this.all_verts.flat()
      this.vertsNoNorms = this.vertsNoNorms.flat()
      this.all32 = new Float32Array(this.all_verts)

    }
//you may be simplifying your array code too much so if you get an error that may be a likely spot
//other then that the most unlikely spot may be 

    helperGetNorms(threeArray) {
        var ret_val = []
        for (var h = 0; h < 3; h++) {
            if (threeArray[h] < 0) {
                ret_val.push(-1)
            } else if (threeArray[h] > 0) {
                ret_val.push(1)
            } else {
                ret_val.push(0)
            }
        }
        return ret_val;
    }

    helperGetUVs(twoArray) {
        var ret_val = []
        for (var h = 0; h < 2; h++) {
            if (twoArray[h] < 0) {
                ret_val.push(-1)
            } else if (twoArray[h] > 0) {
                ret_val.push(1)
            } else if (twoArray[h] == 0) {
                ret_val.push(0)
            }
        }
        return ret_val;
    }
    getSphereVerts() {
        let sum;
        var d=Math.PI/10; 
        var dd = Math.PI/10;
        for (var t = 0; t<Math.PI;t+=d) {
            for (var r=0; r<(2*Math.PI); r+=d) {
                sum = 0;
                var p1 = [
                    Math.sin(t) * Math.cos(r),
                     Math.sin(t) * Math.sin(r), 
                     Math.cos(t)];
                var p1_n = this.helperGetNorms(p1)
                var p2 = [
                    Math.sin(t+dd) * Math.cos(r),  
                    Math.sin(t+dd) * Math.sin(r), 
                    Math.cos(t+dd)]; 
                var p2_n = this.helperGetNorms(p2)
                var p3 = [
                    Math.sin(t)*Math.cos(r+dd), 
                    Math.sin(t)*Math.sin(r+dd), 
                    Math.cos(t)];  
                var p3_n = this.helperGetNorms(p3)
                
                var p4 = [
                    Math.sin(t+dd)*Math.cos(r+dd), 
                    Math.sin(t+dd)*Math.sin(r+dd), 
                    Math.cos(t+dd)]
                 
                var p4_n = this.helperGetNorms(p1)
                
                
                this.all_verts.push(
                    Array().concat(p1, this.helperGetUVs(p1), p1),
                    Array().concat(p2, this.helperGetUVs(p2), p2),
                    Array().concat(p4,this.helperGetUVs(p4), p4),

                    
                    Array().concat(p1, this.helperGetUVs(p1), p1),
                    Array().concat(p4, this.helperGetUVs(p4), p4),
                    Array().concat(p3, this.helperGetUVs(p3), p3)
                );
                this.vertsNoNorms.push(                    
                    Array().concat(p1, this.helperGetUVs(p1)),
                    Array().concat(p2, this.helperGetUVs(p2)),
                    Array().concat(p4, this.helperGetUVs(p4)),

                    
                    Array().concat(p1, this.helperGetUVs(p1)),
                    Array().concat(p4, this.helperGetUVs(p4)),
                    Array().concat(p3, this.helperGetUVs(p3))
                )
            }
        }
    }
    drawTriangleIn3D() {
        //var verts = this.getNormalVertices()
        var all32 = new Float32Array(this.all_verts);
        var n = all32.length / 8;
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
        gl.bufferData(gl.ARRAY_BUFFER, all32, gl.DYNAMIC_DRAW);

        let FSIZE = this.all32.BYTES_PER_ELEMENT;

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
    drawTriangleIn3DNoNormals() {
        var noNorm32 = new Float32Array(this.vertsNoNorms);
        var n = noNorm32.length / 5;
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
        gl.bufferData(gl.ARRAY_BUFFER, noNorm32, gl.DYNAMIC_DRAW);

        let FSIZE = noNorm32.BYTES_PER_ELEMENT;
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
        // // } else 
        // if (is_normal) {
            this.drawTriangleIn3D(this.vert);
        // //} 
        //     this.drawTriangleIn3DNoNormals(this.noNorms)
    }

}
