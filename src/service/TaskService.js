
class TaskService {

    async getTasks() {
        const taskResponse = await fetch('/api/tasks/all')
        .then(response => response.json())
        return taskResponse;
        
    }
        

}

export default new TaskService();