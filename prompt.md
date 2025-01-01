Base Code:
```javascript
const TASK_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
}

class TaskSchedulingSystem {
    tasks = []; // { id: number, user: string, dueAt: date, status: string }
    users = [];
  constructor(maxTasks) {
    if (!Number.isInteger(maxTasks) || maxTasks <= 0) {
      throw new Error("maxTasks must be a positive integer");
    }
    this.maxTasks = maxTasks;
    this.users = new Map();
  }

  addTask(userId, dueDate) {
    if (typeof userId !== 'string' || userId.trim() === '') {
      throw new Error("Invalid userId");
    }

    /**
     *  Todo - check user tasks count,
     *  if user task count is greater than or equal to this.maxTasks then return error
     *  else add task to tasks list and user to user list if not present
     */
  }


  /**
   * Todo - getUser function should return the user tasks
   * if userId is invalid or not present it should throw an error
   **/
  getUser(userId) {

  }

   /**
    * Todo - getTasks function should return all the tasks
    * sortObject { field: string, direction: asc/desc }
    **/
   getTasks(sortObject = {field: "dueAt", direction: "desc"}) {
        // todo - return the sorted tasks array
   }

    /**
     * Todo - deleteTask function to remove task from tasks list
     * if task id is invalid or not present it should throw an error
     **/ 
   deleteTask(taskId) {

   }

    /**
     * Todo - updateTask function to update the task status
     * if taskId is invalid or not present it should throw an error
     * if params.status is invalid or not present in TASK_STATUS it should throw an error
     * if input params are valid it should update the task with params
     **/
   updateTask(taskId, params) {

   }

     /**
     * Todo - getTask function to return the task by taskId
     * if taskId is invalid or not present it should throw an error
     * the function should return the task details alongwith task completionTime (time take to complete the taks) 
     * and inprogressTime (time for which task in `in_progress` status).
     **/
    getTask(taskId) {

    }

}

module.exports = {
    TaskSchedulingSystem
};

```

Prompt:
I’m tasked with developing a Task Scheduling System for a project management app that tracks tasks assigned to users. 
Each user has a set limit on how many tasks they can have simultaneously (determined by maxTasks). 
If a user hits that limit, no more tasks should be assigned unless they complete or remove existing ones.

Help me implement the following functions
1. addTask - Check user tasks count, if active user task count is greater than or equal to this.maxTasks then return an error else add a task to the tasks list and a user to the user list if not present, a new task status should be open. The task with `open` or `in_progress` status is considered active. The due date should be in the future. if no due date is provided, then due date should be set to 30 days from now. This function should return a newly added task.
2. getUser - function should return the user tasks, if userId is invalid or not present it should throw an error.
3. getTasks - function should return all the tasks, it takes sortObject as input sortObject { field: string, direction: asc/desc } and returns the sorted task list as per input sortObject.
4. deleteTask - function to remove the task from the tasks list, if the task id is invalid or not present it should throw an error. This function should return true if the task is deleted from the list. 
5. updateTask - function to update the task status, if taskId is invalid or not present it should throw an error if params. status is invalid or not present in TASK_STATUS it should throw an error, if input params are valid it should update the task with params and return the updated task.
6. getTask - the function should return the task details along with task `completionTime` (time taken to complete the task) and inprogressTime (time for which task in `in_progress` status). completionTime and inprogressTime should round up in hours. If taskId is invalid or not present it should throw an error.