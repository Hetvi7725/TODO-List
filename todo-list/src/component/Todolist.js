import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

function Todolist(){

    let [user , setuser] = useState({});
    let [data , setdata] = useState([]);
    let [search, setsearch] = useState('');

    let [prorecord, setprorecord] = useState([]);
    let [pageno, setpageno] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [PerPage , setPerPage] = useState(4);

    useEffect(()=>{
        getdata();
    })

     let getdata=()=>{
            axios.get("http://localhost:3000/TodoData")
            .then((res)=>{
                setdata(res.data);
                const LastRecord = currentPage * PerPage;
                const FirstRecord = LastRecord - PerPage;
                const currentRecords = res.data.slice(FirstRecord, LastRecord);
                setprorecord(currentRecords);

                const no = Math.ceil(res.data.length /PerPage)
                var pages = [];
                for(let i=1 ; i<=no ; i++) 
                {
                    pages.push(i);
                }
                 setpageno(pages);
            })
            .catch((err)=>{
                console.log(err);
            })
    }

    let getinput=(e)=>{
        let name = e.target.name;
        let value = e.target.value;
        setuser({...user , [name]:value});
    }

    let submitdata=(e)=>{
        e.preventDefault();
        console.log(user);

        axios.post("http://localhost:3000/TodoData" , user)
        .then((res)=>{
            console.log(res.data);
            setuser({});
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    let deletedata=(id)=>{
        axios.delete("http://localhost:3000/TodoData/"+id ,user)
        .then((res)=>{
            console.log(res.data);
            getdata();
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    let searching = (e) => {
        setsearch(e.target.value)
    }

    let selectno=(pagen)=>{
        setCurrentPage(pagen);
        const LastRecord = pagen * PerPage;
        const FirstRecord = LastRecord - PerPage;
        const currentRecords = data.slice(FirstRecord, LastRecord);
        setprorecord(currentRecords);
    }

    return(
        <div style={{backgroundColor:"#0c2445" , color:"white" , padding:"50px 0"}}>
            <h1>TODOLIST</h1>
            <div className="todo"  style={{width:"600px" , border:"2px solid",padding:"30px" ,margin:"0 auto"}}>
                <Form  method="post" onSubmit={(e)=>submitdata(e)}>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label column sm="2">Username</Form.Label>
                        <Col sm="10">
                            <Form.Control type='text' placeholder="Enter Username" name="name" value={user.name?user.name:""}  onChange={(e)=>getinput(e)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label column sm="2">Task</Form.Label>
                        <Col sm="10">
                            <Form.Control type='text' placeholder="Enter Task" name="task" value={user.task?user.task:""}  onChange={(e)=>getinput(e)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label column sm="2">Date</Form.Label>
                        <Col sm="10">
                            <Form.Control type='date' name="date" value={user.date?user.date:""}  onChange={(e)=>getinput(e)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput4">
                    <Form.Label column sm="2">Task Type</Form.Label>
                        <Col sm="10">
                            <Form.Select aria-label="Default select example" name="type" id="type" value={user.type?user.type:""}  onChange={(e)=>getinput(e)}>
                                <option value="Select Category">Select Category</option>
                                <option value="Personal">personal</option>
                                <option value="Family">family</option>
                                <option value="Friend">friend</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <input type="submit" value="Add Task" name="submit" style={{ width:"20%" ,backgroundColor:"#56d2e8" ,border:"0" }}/>
                   
                </Form>
            </div>
            <br/><br/>

            <Form.Control type="text" placeholder="Search" style={{width:"50%" ,  marginLeft:"400px"}} className="mr-sm-2" onChange={(e) => searching(e)} />
                               <br/>
            <div style={{width: "100%", height: "auto", display:"flex", flexWrap:"wrap", marginLeft:"400px"}}>
                {prorecord.filter((v1, i1) => {
                        if (v1.name.match(search)) {
                            return v1
                        }
                        else if(v1.task.match(search)){
                            return v1
                        }
                    }).map((v,i)=>{
                    return(
                            <div style={{width:"150px" , height:"130px",border:"2px solid white", margin:"0 20px", position:"relative"}}>
                                <p>{v.name}</p>
                                <p>{v.task}</p>
                                <div style={{position:"absolute" , left:"0" , bottom:"0" , backgroundColor:"white" , color:"black"}}><p>{v.date}</p></div>
                                <div style={{position:"absolute" , left:"0" , top:"0" , width:"20px", backgroundColor:"white", cursor:"pointer" , color:"black"}} onClick={()=>deletedata(v.id)}><buttton>X</buttton></div>
                            </div>
                        
                        )
                    })}
            </div>
            <Col>
                                        <Pagination>
                                            <div style={{margin:"0 auto", display:"flex" , marginTop:"30px"}}>
                                                {pageno.map((v,i)=>{
                                                    return(
                                                        <Pagination.Item key={v} active={v} onClick={()=>selectno(v)}>{v}</Pagination.Item>
                                                    )
                                                })}
                                            </div>
                                        </Pagination>
                                    </Col>
                </div>
    )
}

export default Todolist;