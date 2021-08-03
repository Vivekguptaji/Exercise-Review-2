"use strict";
(function () {
  let features = {
    todo_items: [
      {
        id: Math.random(),
        name: "Pay Bills",
        status: "incompleted",
        editable: false,
      },
      {
        id: Math.random(),
        name: "Go Shopping",
        status: "incompleted",
        editable: true,
      },
      {
        id: Math.random(),
        name: "See the Doctor",
        status: "completed",
        editable: false,
      },
    ],
    enums: {
      main_container_id: "container",
      label_id: "new-task-label",
      add_task_input_id: "new-task",
      add_btn_text: "Add",
      ul_completed_tasks: "completed-tasks",
      ul_incompleted_tasks: "incompleted-tasks",
      header_inCompleted: "TODO",
      header_completed: "COMPLETED",
      add_todo_label_text: "<b>Add Item</b>",
      addToDo_label_class: "addToDo_label",
      localStorageKey: "todo_items",
      save_btn_text: "Save",
      edit_btn_text: "Edit",
      toggleCss: "editMode",
      delete_btn_text: "Delete",
      span_err_cls: "todo_span_show",
      todo_placeholder: "Please Enter TODO",
      input_error_cls: "input_error",
      todo_span_cls: "todo_span",
      incompleted_h3_cls: "incompleted_h3",
      completed_h3_cls: "completed_h3",
      input_checkbox: "input[type=checkbox]",
      status: {
        incompleted: "incompleted",
        completed: "completed",
      },
      element_type: {
        label: "label",
        button: "button",
        input: "input",
        h3: "h3",
        ul: "ul",
        span: "span",
        li: "li",
        checkbox: "checkbox",
        p: "p",
      },
    },
    createLabel: function (id, htmlFor, className, innerHTML) {
      /*create label element*/
      let labelEl = document.createElement(this.enums.element_type.label);
      (labelEl.id = id),
        (labelEl.htmlFor = htmlFor),
        (labelEl.ariaLabel = htmlFor),
        (labelEl.className = className),
        (labelEl.innerHTML = innerHTML);
      return labelEl;
    },
    createButton: function (innerText, clickFn, className) {
      /*create button element*/
      let buttonEl = document.createElement(this.enums.element_type.button);
      (buttonEl.innerText = innerText),
        (buttonEl.onclick = clickFn),
        (buttonEl.ariaLabel = innerText),
        (buttonEl.ariaRoleDescription = "button"),
        (buttonEl.className = className);
      return buttonEl;
    },
    createInput: function (id, type, checked, fn, value) {
      /*create input element*/
      let inputEl = document.createElement(this.enums.element_type.input);
      (inputEl.id = id),
        (inputEl.type = type),
        (inputEl.onclick = fn),
        (inputEl.checked = checked),
        (inputEl.value = !value ? "" : value);
      if (type === this.enums.element_type.checkbox) {
        inputEl.ariaChecked =
          value === this.enums.status.incompleted ? false : true;
        inputEl.ariaLabel = "checkbox";
      } else {
        inputEl.ariaLabel = "textbox";
      }
      return inputEl;
    },
    createH3: function (innerHTML, className) {
      /*create h3 tag*/
      let el = document.createElement(this.enums.element_type.h3);
      el.innerHTML = innerHTML;
      el.className = className;
      return el;
    },
    createUl: function (id) {
      /*create ul element*/
      let el = document.createElement(this.enums.element_type.ul);
      el.id = id;
      return el;
    },
    createSpan: function (innerHTML, className) {
      let span_el = document.createElement(this.enums.element_type.span);
      span_el.innerHTML = innerHTML;
      span_el.className = className;
      return span_el;
    },
    createlistItem: function (item, status) {
      /*Creating list items and binding events to generated elements.*/
      if (item.status !== status) {
        return;
      }
      let li_el = document.createElement(this.enums.element_type.li);

      let input_el = this.createInput(
        item.id + "_text",
        "text",
        null,
        null,
        item.name
      );
      input_el.placeholder = this.enums.todo_placeholder;
      input_el.onkeypress = (el) => {
        let ipt_el = el;
        ipt_el.currentTarget.classList.remove(this.enums.input_error_cls);
      };
      let checkBox_el = this.createInput(
        item.id + "_" + this.enums.element_type.checkbox,
        this.enums.element_type.checkbox,
        item.status === this.enums.status.completed ? true : "",
        this.taskMovement.bind(this, li_el, input_el),
        item.status
      );
      let label_el = this.createLabel(
        item.id + "_" + this.enums.element_type.label,
        item.name,
        "",
        item.name
      );
      let edit_btn_el = this.createButton(
        item.editable ? this.enums.save_btn_text : this.enums.edit_btn_text,
        this.onEditClick.bind(this, li_el, input_el, label_el),
        this.enums.edit_btn_text.toLowerCase()
      );
      let delete_btn_el = this.createButton(
        this.enums.delete_btn_text,
        this.onDeleteClick.bind(this, li_el),
        this.enums.delete_btn_text.toLowerCase()
      );
      li_el.id = item.id;

      li_el.className = item.editable ? this.enums.toggleCss : "";
      li_el.append(checkBox_el, label_el, input_el, edit_btn_el, delete_btn_el);
      return li_el;
    },
    setLocalStorage: function (items) {
      /*localstorage updation*/
      localStorage.setItem(this.enums.localStorageKey, JSON.stringify(items));
      if (items.length === 0) {
        localStorage.removeItem(this.enums.localStorageKey);
      }
    },
    onEditClick: function (scope, input_el, label_el, el) {
      /* On edit, switch button text and on save updating to local storage*/
      let btn_text = el.srcElement.innerHTML;
      let input_value = input_el.value;
      if (
        input_value.trim().length === 0 &&
        btn_text === this.enums.save_btn_text
      ) {
        input_el.classList.add(this.enums.input_error_cls);
        input_el.focus();
        return;
      }
      let find_todo_items = this.todo_items.find(
        (item) => item.id == +scope.id
      );
      if (btn_text === this.enums.save_btn_text) {
        find_todo_items.name = input_value;
        label_el.innerHTML = input_value;
      }
      find_todo_items.editable =
        btn_text === this.enums.save_btn_text ? false : true;
      this.setLocalStorage(this.todo_items);
      btn_text =
        btn_text === this.enums.save_btn_text
          ? this.enums.edit_btn_text
          : this.enums.save_btn_text;
      el.srcElement.innerHTML = btn_text;
      scope.classList.toggle(this.enums.toggleCss);
      if (btn_text === this.enums.edit_btn_text || this.enums.save_btn_text) {
        setTimeout(() => {
          input_el.focus();
        }, 1000);
      }
    },
    onDeleteClick: function (el) {
      /*deleting items and updating local storage*/
      el.parentNode.removeChild(el);
      this.todo_items = this.todo_items.filter((item) => item.id !== +el.id);
      this.setLocalStorage(this.todo_items);
    },
    onAddTodoItem: function (input_el, span_el) {
      /*Adding a new item to the list and updating the local storage*/
      let enter_text = input_el.value;
      if (enter_text.trim().length === 0) {
        span_el.classList.add(this.enums.span_err_cls);
        input_el.classList.add(this.enums.input_error_cls);
        input_el.focus();
        return;
      }
      let item = {
        id: Math.random(),
        name: enter_text,
        status: this.enums.status.incompleted,
        editable: false,
      };
      this.todo_items.unshift(item);
      let li_el = features.createlistItem(item, this.enums.status.incompleted);
      let contianerEl = document.getElementById(
        this.enums.ul_incompleted_tasks
      );
      contianerEl.appendChild(li_el);
      this.setLocalStorage(this.todo_items);
      input_el.value = "";
    },
    taskMovement: function (el, input_el) {
      /*switch item status*/
      let obj = this.todo_items.find((o) => o.id === +el.id);
      let checkBox_el = el.querySelector(this.enums.input_checkbox);
      if (input_el.value.trim().length === 0) {
        input_el.classList.add(this.enums.input_error_cls);
        checkBox_el.checked = false;
        checkBox_el.ariaChecked = false;
        input_el.focus();
        return;
      }
      let container_ul =
        obj.status === this.enums.status.completed
          ? this.enums.ul_incompleted_tasks
          : this.enums.ul_completed_tasks;
      obj.status =
        obj.status === this.enums.status.completed
          ? this.enums.status.incompleted
          : this.enums.status.completed;
      checkBox_el.ariaChecked = checkBox_el.checked;
      let contianerEl = document.getElementById(container_ul);
      contianerEl.appendChild(el);
      this.setLocalStorage(this.todo_items);
    },
    createItemSection: function (header, type) {
      /*Create list item section based on status */
      let contianerEl = document.getElementById(this.enums.main_container_id);
      let h3_el = this.createH3(
        `<label aria-label="${header}">${header}</label>`,
        this.enums.status[type] === this.enums.status.incompleted
          ? this.enums.incompleted_h3_cls
          : this.enums.completed_h3_cls
      );
      let ul_el = this.createUl(this.enums.element_type.ul);
      ul_el.id = `${this.enums.status[type]}-tasks`;
      this.todo_items.forEach((item) => {
        if (this.createlistItem(item, this.enums.status[type])) {
          ul_el.append(this.createlistItem(item, this.enums.status[type]));
        }
      });
      contianerEl.insertAdjacentElement("beforeend", h3_el);
      contianerEl.appendChild(ul_el);
    },
    onload: function () {
      /*
           Will call the first function,
           select the initial todo list,
           add item render section, and render item list
          */
      let storedItems = localStorage.getItem(this.enums.localStorageKey);
      if (storedItems) {
        this.todo_items = JSON.parse(storedItems);
      } else {
        this.setLocalStorage(this.todo_items);
      }
      let contianerEl = document.getElementById(this.enums.main_container_id);
      let paragraph = document.createElement(this.enums.element_type.p);
      let label = this.createLabel(
        this.enums.label_id,
        this.enums.add_task_input_id,
        this.enums.addToDo_label_class,
        this.enums.add_todo_label_text
      );
      let inputEl = this.createInput(this.enums.add_task_input_id, "text");
      let span_el = this.createSpan(
        this.enums.todo_placeholder,
        this.enums.todo_span_cls
      );
      inputEl.placeholder = this.enums.todo_placeholder;
      inputEl.ariaLabel = this.enums.todo_placeholder;
      inputEl.ariaRoleDescription = "textbox";
      inputEl.onkeypress = (el) => {
        let span = span_el;
        let ipt_el = el.srcElement;
        ipt_el.classList.remove(this.enums.input_error_cls);
        span.classList.remove(this.enums.span_err_cls);
      };

      let buttonEl = this.createButton(
        this.enums.add_btn_text,
        this.onAddTodoItem.bind(this, inputEl, span_el)
      );

      contianerEl.append(paragraph);
      paragraph.append(label, inputEl, buttonEl, span_el);
      inputEl.tabIndex = 0;
      inputEl.focus();
      /* creating incompleted list items */
      this.createItemSection(
        this.enums.header_inCompleted,
        this.enums.status.incompleted
      );
      /* creating completed list items */
      this.createItemSection(
        this.enums.header_completed,
        this.enums.status.completed
      );
    },
  };
  features.onload();
})();
