document.addEventListener('DOMContentLoaded', function () {
    //tô màu job hoàn tất khi load page
    (() => {
        const domCheckBoxChecked = Array.from(document.querySelectorAll('input[type=checkbox][checked]'))
        domCheckBoxChecked.forEach(dom => {
            const parent = dom.parentElement;
            parent.classList.remove('bg-light');
            parent.classList.add('bg-success');
        });
    })();
    //

    //hiệu ứng hoàn tất
    (() => {
        const domCheckBox = Array.from(document.getElementsByClassName('checkbox'));
        domCheckBox.forEach(dom => {
            dom.addEventListener('change', async function () {
                const parent = this.parentElement;
                parent.classList.add('bg-light');
                parent.classList.remove('bg-success');
                if (this.checked) {
                    parent.classList.remove('bg-light');
                    parent.classList.add('bg-success');
                }

                //update database isDone
                let jobGroupId = this.dataset.jobgroupid;
                let jobId = this.dataset.jobid;
                let result = await fetch(`/user/${jobGroupId}/job/${jobId}`, {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        isDone: this.checked
                    })
                })
                //
            })
        });
    })();
    //

    //Hiện modal xác nhận xóa công việc
    (() => {
        const domBtnDeleteJob = Array.from(document.getElementsByClassName('btnDeleteJob'));
        domBtnDeleteJob.forEach(dom => {
            dom.addEventListener('click', function () {
                const jobGroupId = this.dataset.jobgroupid;
                const jobId = this.dataset.jobid;
                const domBtnAccept = document.querySelector('#btnAcceptDeleteJobModal');
                domBtnAccept.dataset.jobgroupid = jobGroupId;
                domBtnAccept.dataset.jobid = jobId;
                $('#deleteJobModal').modal();
            })
        });
    })();
    //

    //Hiện modal sửa tên công việc
    (() => {
        const domBtnEditJob = Array.from(document.getElementsByClassName('btnEditJob'));
        domBtnEditJob.forEach(dom => {
            dom.addEventListener('click', function () {
                const textJob = this.parentElement.previousElementSibling.textContent;
                const jobGroupId = this.dataset.jobgroupid;
                const jobId = this.dataset.jobid;
                const domBtnAccept = document.querySelector('#btnAcceptEditJobModal');
                domBtnAccept.dataset.jobgroupid = jobGroupId;
                domBtnAccept.dataset.jobid = jobId;
                $('#editJobModal').modal();
                document.querySelector('#editJobName').value = textJob;
            })
        });
    })();
    //

    //Tạo nhóm công việc mới
    (() => {
        const input = document.getElementById('iptNewJobGroup');
        const button = document.getElementById('btnNewJobGroup');

        input.addEventListener('keydown', function (e) {
            if (e.keyCode === 13) {
                button.click();
            }
        });

        button.addEventListener('click', async function () {
            if (input.value === '') {
                alert("Tên nhóm không được để trống !");
                return;
            }
            let result = await fetch('/user', {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    jobGroupName: input.value
                })
            })
            if (result.ok) {
                window.location = '/';
            }
        });
    })();
    //

    //Tạo công việc mới
    (() => {
        const buttons = Array.from(document.getElementsByClassName('btnNewJob'));
        const inputs = Array.from(document.getElementsByClassName('iptNewJob'));

        buttons.forEach(function (button) {
            button.addEventListener('click', async function () {
                let input = this.previousElementSibling;
                if (input.value === '') {
                    alert("Tên công việc không được để trống !");
                    return;
                }
                let jobGroupId = this.dataset.jobgroupid;
                let result = await fetch(`/user/${jobGroupId}`, {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        jobName: input.value
                    })
                })
                if (result.ok) {
                    window.location = '/';
                }
            });
        });

        inputs.forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                let button = this.nextElementSibling;
                if (e.keyCode === 13) {
                    button.click();
                }
            });
        });
    })();
    //

    //Sửa công việc
    (() => {
        const button = document.getElementById('btnAcceptEditJobModal');
        const textArea = document.getElementById('editJobName');
        button.addEventListener('click', async function () {
            if (textArea.value === '') {
                alert('Tên công việc không được để trống !')
                return;
            }
            let jobGroupId = this.dataset.jobgroupid;
            let jobId = this.dataset.jobid;
            let result = await fetch(`/user/${jobGroupId}/job/${jobId}`, {
                method: 'put',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: textArea.value
                })
            });
            if (result.ok) {
                window.location = '/';
            }
        });
    })();
    //

    //Xóa công việc /user/:jobGroupId/job/:jobId
    (() => {
        const button = document.getElementById('btnAcceptDeleteJobModal');
        button.addEventListener('click', async function () {
            let jobGroupId = this.dataset.jobgroupid;
            let jobId = this.dataset.jobid;
            let result = await fetch(`/user/${jobGroupId}/job/${jobId}`, {
                method: 'delete'
            })
            if (result.ok) {
                window.location = '/';
            }
        });
    })();
    //

})