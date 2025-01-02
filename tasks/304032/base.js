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
   delete(taskId) {

   }

    /**
     * Todo - updateTask function to update the task status
     * if taskId is invalid or not present it should throw an error
     * if params.status is invalid or not present in TASK_STATUS it should throw an error
     * if input params are valid it should update the task with params
     **/
   updateTask(taskId, params) {

   }
}

module.exports = {
    TaskSchedulingSystem
};