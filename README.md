# nodejs8rightway
codebase for the book 'NodeJS 8 the Right Way' by Jim R Wilson <br/>
(for chapter 7, instead of working with NodeJS, I decided to use NestJS to build the b4 api) <br/>
used some config and settings files fro https://github.com/zucchinidev/node-js-8-the-right-way <br/>
<br/>
<br/>

Running Instruction: <br/>
To run... <br/>
<br/>
CHAPTER 5: <br/>
npm i <br/>
<br/>
CHAPTER 6: <br/>
npm i (optional) <br/>
#comment out service.main in docker-compose.yml <br/>
docker-compose up <br/>
cd /src/esclu <br/>
npm i <br/>
./esclu bulk ../data/bulk_pg.ldj -i books -t book > ../data/bulk_result.json <br/>

CHAPTER 7: <br/>
npm i (optional) <br/>
#uncomment service.main in docker-compose.yml (if you did for part 6) <br/>
docker-compose up <br/>
cd /src/esclu <br/>
npm i <br/>
./esclu bulk ../data/bulk_pg.ldj -i books -t book > ../data/bulk_result.json <br/>
cd ../../ (back to nodejs-8-right) <br/>
docker-compose up <br/>
cd src/b4 (optional, if you want to edit something in b4) <br/>
npm i (optional, if you want to edit something in b4) <br/>





