var checkCompany = false; 
$('.find-company').on('click', function() {
    checkCompany = !checkCompany;
    chooseOption('#company', '.companies');
    if (checkCompany == true) { 
        showOption('.all-company', function() {});
        console.log(checkCompany);
    } else { 
        hideOption('.all-company', function() {});
    }
    clickOutElement('.find-company', function() {
        checkCompany = false;
        hideOption('.all-company', function() {});
    })
})