plugins {
    id("java")
    id("application")
}

group = "za.co.wethinkcode"
version = "1.0-SNAPSHOT"

application {
    mainClass.set("za.co.wethinkcode.taskmanager.cli.TaskManagerCli")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("commons-cli:commons-cli:1.9.0")
    implementation("com.google.code.gson:gson:2.11.0")
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}