from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QFileDialog
from PyQt5.QtGui import QRegExpValidator
from PyQt5.QtCore import QRegExp
import sys
import os
import os.path
import shutil
import json
import re
from managerUi import Ui_MainWindow

app = QtWidgets.QApplication(sys.argv)
MainWindow = QtWidgets.QMainWindow()
ui = Ui_MainWindow()
ui.setupUi(MainWindow)
MainWindow.show()
# variables
dataFile = 'config.json'
checkJson = None
path = ''
username = os.path.expanduser('~')
versionEdit = ui.lineEdit
validator = QRegExpValidator(QRegExp("^1\.[0-9]{1,2}\.[0-9]{1,2}|1\.[0-9]{1,2}"))
versionEdit.setValidator(validator)
version = ''
versions = []

# active button
ui.home.setStyleSheet("QPushButton{background-color:#569F55;}")

# check if file exists
if os.path.isfile(dataFile):
    checkJson = True
    with open(dataFile, 'r') as myfile:
        obj = json.load(myfile)
        path = obj['path']
        versions = obj['versions']
        version = obj['version']
        ui.lineEdit_2.setText(path)
        ui.label.setText(version)
        for i in versions:
            ui.listWidget.addItem(i)
            ui.listWidget_2.addItem(i)
    if len(path) > 0:
        ui.groupBox_1.hide()
else:
    ui.pushButton_5.setEnabled(False)
    checkJson = False

# functions
# choose mods folder
def getDirectory():
    dir_path = QFileDialog.getExistingDirectory(None, "Choose Directory", username + "\AppData\Roaming")
    ui.lineEdit_3.setText(dir_path)
    ui.lineEdit_2.setText(dir_path)
    createDirectoryPath = os.path.dirname(dir_path) + '/umods'
    os.mkdir(createDirectoryPath)
    if len(dir_path) > 0:
        if not checkJson:
            data = {"path": dir_path, "versions": [], "version": ''}
            with open(dataFile, "w") as j:
                json.dump(data, j)
        ui.pushButton_5.setEnabled(True)
    global path
    path = ui.lineEdit_3.text()

# update directory path in settings page
def updateDirectory():
    uFiles = os.path.dirname(path) + "/umods"
    uFilesDir = os.listdir(uFiles)
    for f in uFilesDir:
        shutil.move(uFiles + "/" + f, path)
    os.rmdir(uFiles)
    dir_path = QFileDialog.getExistingDirectory(None, "Choose Directory", path)
    ui.lineEdit_2.setText(dir_path)
    ui.label.setText("")
    global version
    version = ""
    if len(dir_path) > 0:
            data = {"path": dir_path, "versions": versions, "version": version}
            with open(dataFile, "w") as j:
                json.dump(data, j)
    else:
        ui.lineEdit_2.setText(path)
    os.mkdir(uFiles)

# check version format
def addVersion():
    dublicate = None
    for i in range(ui.listWidget_2.count()):
        if versionEdit.text() == ui.listWidget_2.item(i).text():
            ui.msg.setText('This version has been added earlier')
            ui.msg.exec()
            dublicate = True

    if versionEdit.hasAcceptableInput():
        if versionEdit.text():
            if not dublicate:
                ui.listWidget_2.addItem(versionEdit.text())
                global versions
                versions.append(versionEdit.text())
                with open("config.json", "r+") as file:
                    data = json.load(file)
                    data['versions'].append(versionEdit.text())
                    ui.listWidget.addItem(versionEdit.text())
                    file.seek(0)
                    json.dump(data, file)
                    file.truncate()
                versionEdit.setText("")
    else:
        ui.msg.setText("Invalid version format")
        ui.msg.exec()

# change lineEdit style when version format is wrong
def addVersionStyle():
    if not versionEdit.hasAcceptableInput():
        versionEdit.setStyleSheet(
            "QLineEdit{border:1px solid #FAFF00;border-radius:3px;background-color:#CCCF30;font-size:20px;color:white;padding-left:10px;}")
    if not versionEdit.text():
        versionEdit.setStyleSheet(
            "QLineEdit{border:transparent;border-radius:3px;background-color:#569F55;font-size:20px;color:white;padding-left:10px;}")
    if versionEdit.hasAcceptableInput():
        versionEdit.setStyleSheet(
            "QLineEdit{border:transparent;border-radius:3px;background-color:#569F55;font-size:20px;color:white;padding-left:10px;}")

# sidebar navigation
def changePage(index):
    ui.listWidget.setCurrentRow(-1)
    for btn in ui.groupBox.findChildren(QtWidgets.QPushButton):
        if btn != ui.pushButton.sender().objectName():
            btn.setStyleSheet("")
            ui.logo.setStyleSheet("QPushButton:hover{background-color:#468245;}")
    ui.pushButton.sender().setStyleSheet("QPushButton{background-color:#569F55;}")
    ui.stackedWidget.setCurrentIndex(index)

# mods activation
def activateMods():
    curItem = ui.listWidget.currentItem()
    if curItem == None:
        ui.msg_2.exec()
    else:
        if curItem.text() == ui.label.text():
            ui.msg_4.exec()
            ui.listWidget.setCurrentRow(-1)
        else:
            dest = os.path.dirname(path) + "/umods"
            sourceFiles = os.listdir(path)
            destFiles = os.listdir(dest)
            checkVersion = None
            for f in sourceFiles:
                if curItem.text() in f:
                    checkVersion = True
                    break
            for f in destFiles:
                if curItem.text() in f:
                    checkVersion = True
                    break
            if not checkVersion:
                ui.msg_5.exec()
                ui.listWidget.setCurrentRow(-1)
            else:
                try:
                    for f in sourceFiles:
                        if curItem.text() not in f:
                            shutil.move(path + "/" + f, dest)
                        if curItem.text() in f:
                            addCheck = f.split(curItem.text(),1)[1]
                            if re.search("^\.\d",addCheck) is not None:
                                shutil.move(path + "/" + f, dest)
                    for f in destFiles:
                        if curItem.text() in f:
                            addCheck = f.split(curItem.text(), 1)[1]
                            if not re.search("^\.\d", addCheck):
                                shutil.move(dest + "/" + f, path)
                    version = curItem.text()
                    ui.label.setText(version)
                    ui.msg_3.exec()
                    with open("config.json", "r+") as file:
                        data = json.load(file)
                        data['version'] = version
                        file.seek(0)
                        json.dump(data, file)
                        file.truncate()
                    ui.listWidget.setCurrentRow(-1)
                except OSError as error:
                    ui.msg_2.setText("Error:'% s'" %error)
                    ui.msg_2.exec()

# buttons connect
versionEdit.textEdited.connect(addVersionStyle)
ui.home.clicked.connect(lambda: changePage(0))
ui.versions.clicked.connect(lambda: changePage(1))
ui.settings.clicked.connect(lambda: changePage(2))
ui.pushButton.clicked.connect(activateMods)
ui.pushButton_2.clicked.connect(addVersion)
ui.pushButton_3.clicked.connect(updateDirectory)
ui.pushButton_4.clicked.connect(getDirectory)
ui.pushButton_5.clicked.connect(lambda: ui.groupBox_1.hide())

sys.exit(app.exec_())