export const gouroudV = `
    precision mediump float;

    //Output
    varying vec4 vColor;
    varying vec3 vPos;
    varying vec3 vNormal;


    struct LightSource{
        vec3 lightPos;
        float ka;
        vec3 ambientColor;
        float kd;
        vec3 diffuseColor;
        float ks;
        vec3 specularColor;
        float shininess;
        bool on;
        };

    uniform LightSource light1;
    uniform LightSource light2;
    uniform LightSource light3;

    vec4 intensity(LightSource light){
        // Ambient Intensity
        vec3 Ia = light.ka * light.ambientColor;
        
        vec3 N = normalize(vNormal);
        vec3 L = normalize(light.lightPos - vPos);
        float lambertian = max(dot(N,L),0.0);
        
        //Diffuse Intensity
        vec3 Id = light.kd * lambertian * light.diffuseColor;
        
        // Specular intensity
        float specular = 0.0;
        if (lambertian > 0.0){
            //reflected light L
            vec3 R = reflect(-L,N);
            // vector to viewer
            vec3 V = normalize(-vPos);
            float A_spec = max(dot(R,V),0.0);
            specular = pow(A_spec,light.shininess);
        }
        vec3 Is = light.ks * specular * light.specularColor;
        return vec4(Ia + Id + Is, 1.0);
    }

    void main(){
        vec4 vertPos4 = modelViewMatrix * vec4(position,1.0);
        vPos = vec3(vertPos4)/vertPos4.w;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * vertPos4; 

        if(light1.on){
            vColor += intensity(light1);
        }
                
        if(light2.on){
            vColor += intensity(light2);
        }

        if(light3.on){
            vColor += intensity(light3);
        }
    }
`;

export const gouroudPhongBingV = `
    precision mediump float;
    //Output
    varying vec4 vColor;
    varying vec3 vPos;
    varying vec3 vNormal;
    struct LightSource{
        vec3 lightPos;
        float ka;
        vec3 ambientColor;
        float kd;
        vec3 diffuseColor;
        float ks;
        vec3 specularColor;
        float shininess;
        bool on;
    };

    vec4 intensity(LightSource light){
        // Ambient Intensity
        vec3 Ia = light.ka * light.ambientColor;
        
        vec3 N = normalize(vNormal);
        vec3 L = normalize(light.lightPos - vPos);
        float lambertian = max(dot(N,L),0.0);
        
        //Diffuse Intensity
        vec3 Id = light.kd * lambertian * light.diffuseColor;
        
        // Specular intensity
        float specular = 0.0;
        if (lambertian > 0.0){
            vec3 H = normalize(L + vPos);
            float A_spec = max(dot(H,normalize(-vNormal)),0.0);
            specular = pow(A_spec,light.shininess);
        }
        vec3 Is = light.ks * specular * light.specularColor;
        return vec4(Ia + Id + Is, 1.0);
    }

    uniform LightSource light1;
    uniform LightSource light2;
    uniform LightSource light3;

    void main(){
        vec4 vertPos4 = modelViewMatrix * vec4(position,1.0);
        vPos = vec3(vertPos4)/vertPos4.w;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * vertPos4; 
    
        if(light1.on){
            vColor += intensity(light1);
        }
                    
        if(light2.on){
            vColor += intensity(light2);
        }

        if(light3.on){
            vColor += intensity(light3);
        }
    }
`;

export const phongV = `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 sPos;

    void main() {
        vec4 temp = modelViewMatrix * vec4(position,1.0);
        vPos = vec3(temp)/temp.w;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * temp; 
    }
`;
